// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./ReputationEngine.sol";
import "../dojo/SkillRegistry.sol";

/**
 * @title JobMarket — Autonomous Worker Job Board
 * @notice Buyers post jobs, Workers accept & complete them, mutual reviews.
 *         Reputation updates happen automatically via ReputationEngine.
 *         Supports bilateral Airbnb-style reviews (buyer rates worker, worker rates buyer).
 *         H-02 fix: Job deadlines + reclaim. H-03 fix: Auto-release after rating window.
 */
contract JobMarket {
    enum JobStatus { Open, InProgress, Completed, Rated, Cancelled, Expired }

    struct Job {
        address buyer;
        address worker;
        string description;
        uint256 reward;
        uint256 preferredSkillId; // 0 = open to all
        JobStatus status;
        uint8 buyerRating;  // buyer rates worker (1-5, 0 = not rated)
        uint8 workerRating; // worker rates buyer (1-5, 0 = not rated)
        uint256 createdAt;
        uint256 deadline;     // H-02: job must be completed by this time
        uint256 completedAt;  // H-03: when worker marked complete (for auto-release timer)
    }

    /// @notice Rating window — buyer has this long to rate after completion before worker can auto-claim
    uint256 public constant RATING_WINDOW = 3 days;

    ReputationEngine public immutable reputationEngine;
    SkillRegistry public immutable skillRegistry;
    address public immutable owner;

    uint256 public nextJobId = 1;
    mapping(uint256 => Job) public jobs;
    uint256[] private _openJobIds;
    // Track open job index for efficient removal
    mapping(uint256 => uint256) private _openJobIndex;
    // H-01 fix: Track accumulated protocol fees separately from escrow
    uint256 public accumulatedFees;

    event JobPosted(uint256 indexed jobId, address indexed buyer, string description, uint256 reward, uint256 preferredSkillId);
    event JobAccepted(uint256 indexed jobId, address indexed worker);
    event JobCompleted(uint256 indexed jobId, address indexed worker);
    event BuyerRatedWorker(uint256 indexed jobId, address indexed buyer, address indexed worker, uint8 rating);
    event WorkerRatedBuyer(uint256 indexed jobId, address indexed worker, address indexed buyer, uint8 rating);
    event JobCancelled(uint256 indexed jobId, address indexed buyer);
    event JobExpired(uint256 indexed jobId, address indexed buyer);
    event JobAutoReleased(uint256 indexed jobId, address indexed worker, uint256 payout);

    constructor(address _reputationEngine, address _skillRegistry) {
        require(_reputationEngine != address(0), "zero address");
        require(_skillRegistry != address(0), "zero address");
        reputationEngine = ReputationEngine(_reputationEngine);
        skillRegistry = SkillRegistry(_skillRegistry);
        owner = msg.sender;
    }

    /// @notice Buyer posts a job with reward locked in contract
    /// @param description Job description
    /// @param preferredSkillId Required skill (0 = open to all)
    /// @param durationSeconds How long the worker has to complete (H-02: deadline enforcement)
    function postJob(
        string calldata description,
        uint256 preferredSkillId,
        uint256 durationSeconds
    ) external payable returns (uint256 jobId) {
        require(msg.value > 0, "reward required");
        require(durationSeconds >= 1 hours && durationSeconds <= 30 days, "duration 1h-30d");

        jobId = nextJobId++;
        jobs[jobId] = Job({
            buyer: msg.sender,
            worker: address(0),
            description: description,
            reward: msg.value,
            preferredSkillId: preferredSkillId,
            status: JobStatus.Open,
            buyerRating: 0,
            workerRating: 0,
            createdAt: block.timestamp,
            deadline: block.timestamp + durationSeconds,
            completedAt: 0
        });

        // Track in open jobs list
        _openJobIndex[jobId] = _openJobIds.length;
        _openJobIds.push(jobId);

        emit JobPosted(jobId, msg.sender, description, msg.value, preferredSkillId);
    }

    /// @notice H-02: Buyer reclaims funds from expired in-progress job (worker missed deadline)
    function reclaimExpiredJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.buyer == msg.sender, "only buyer");
        require(job.status == JobStatus.InProgress, "not in progress");
        require(block.timestamp > job.deadline, "deadline not passed");

        uint256 reward = job.reward;
        job.status = JobStatus.Expired;

        emit JobExpired(jobId, msg.sender);

        (bool ok, ) = msg.sender.call{value: reward}("");
        require(ok, "refund failed");
    }

    /// @notice H-03: Worker auto-claims payment if buyer doesn't rate within RATING_WINDOW
    function autoRelease(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.worker == msg.sender, "only worker");
        require(job.status == JobStatus.Completed, "not completed");
        require(job.completedAt > 0, "completion not recorded");
        require(block.timestamp > job.completedAt + RATING_WINDOW, "rating window active");

        // Auto-release with base fee (no reputation bonus since no rating)
        uint256 baseFeeBps = 500;
        uint256 fee = (job.reward * baseFeeBps) / 10000;
        uint256 payout = job.reward - fee;

        job.status = JobStatus.Rated;
        accumulatedFees += fee;

        emit JobAutoReleased(jobId, msg.sender, payout);

        (bool ok, ) = msg.sender.call{value: payout}("");
        require(ok, "payout failed");
    }

    /// @notice Worker accepts an open job
    function acceptJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "job not open");
        require(job.buyer != msg.sender, "buyer cannot accept own job");

        job.worker = msg.sender;
        job.status = JobStatus.InProgress;

        // Remove from open jobs
        _removeFromOpenJobs(jobId);

        emit JobAccepted(jobId, msg.sender);
    }

    /// @notice Worker marks job as completed (must be before deadline)
    function completeJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.InProgress, "job not in progress");
        require(job.worker == msg.sender, "only worker can complete");
        require(block.timestamp <= job.deadline, "deadline passed");

        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
        emit JobCompleted(jobId, msg.sender);
    }

    /// @notice Buyer rates the worker (1-5) — triggers reputation update + payout
    /// @dev CEI pattern: checks → effects → interactions (reentrancy-safe)
    function buyerRateWorker(uint256 jobId, uint8 score) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Completed || job.status == JobStatus.Rated, "job not completed");
        require(job.buyer == msg.sender, "only buyer can rate worker");
        require(job.buyerRating == 0, "already rated");
        require(score >= 1 && score <= 5, "score must be 1-5");

        // Effects FIRST (CEI pattern — prevents reentrancy)
        job.buyerRating = score;
        job.status = JobStatus.Rated;

        // Update worker reputation — use preferredSkillId, or 0 for general
        uint256 skillId = job.preferredSkillId;
        reputationEngine.updateReputation(job.worker, skillId, score);

        // Calculate fee based on reputation
        uint256 baseFeeBps = 500; // 5% base fee
        uint256 adjustedFeeBps = reputationEngine.calculateFee(job.worker, baseFeeBps);
        uint256 fee = (job.reward * adjustedFeeBps) / 10000;
        uint256 payout = job.reward - fee;

        // H-01 fix: Track fee separately
        accumulatedFees += fee;

        emit BuyerRatedWorker(jobId, msg.sender, job.worker, score);

        // Interactions LAST (CEI pattern)
        (bool ok, ) = job.worker.call{value: payout}("");
        require(ok, "payout failed");
    }

    /// @notice Worker rates the buyer (1-5) — mutual review (Airbnb model)
    function workerRateBuyer(uint256 jobId, uint8 score) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Completed || job.status == JobStatus.Rated, "job not completed");
        require(job.worker == msg.sender, "only worker can rate buyer");
        require(job.workerRating == 0, "already rated");
        require(score >= 1 && score <= 5, "score must be 1-5");

        job.workerRating = score;

        // Update buyer reputation (skillId 0 = general buyer reputation)
        reputationEngine.updateReputation(job.buyer, 0, score);

        emit WorkerRatedBuyer(jobId, msg.sender, job.buyer, score);
    }

    /// @notice Buyer can cancel an open (unaccepted) job and get refund
    /// @dev CEI pattern: effects before interactions
    function cancelJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "can only cancel open jobs");
        require(job.buyer == msg.sender, "only buyer can cancel");

        uint256 reward = job.reward;
        job.status = JobStatus.Cancelled;
        _removeFromOpenJobs(jobId);

        emit JobCancelled(jobId, msg.sender);

        (bool ok, ) = msg.sender.call{value: reward}("");
        require(ok, "refund failed");
    }

    /// @notice Get all open job IDs
    function getOpenJobs() external view returns (uint256[] memory) {
        return _openJobIds;
    }

    /// @notice Get job details
    function getJob(uint256 jobId) external view returns (
        address buyer,
        address worker,
        string memory description,
        uint256 reward,
        uint256 preferredSkillId,
        JobStatus status,
        uint8 buyerRating,
        uint8 workerRating,
        uint256 createdAt
    ) {
        Job storage j = jobs[jobId];
        return (j.buyer, j.worker, j.description, j.reward, j.preferredSkillId, j.status, j.buyerRating, j.workerRating, j.createdAt);
    }

    /// @notice Withdraw accumulated protocol fees only — escrow funds protected (H-01 fix)
    function withdrawFees() external {
        require(msg.sender == owner, "only owner");
        uint256 fees = accumulatedFees;
        require(fees > 0, "no fees");
        accumulatedFees = 0;
        (bool ok, ) = owner.call{value: fees}("");
        require(ok, "withdraw failed");
    }

    // --- Internal ---

    function _removeFromOpenJobs(uint256 jobId) private {
        uint256 idx = _openJobIndex[jobId];
        uint256 lastIdx = _openJobIds.length - 1;
        if (idx != lastIdx) {
            uint256 lastJobId = _openJobIds[lastIdx];
            _openJobIds[idx] = lastJobId;
            _openJobIndex[lastJobId] = idx;
        }
        _openJobIds.pop();
        delete _openJobIndex[jobId];
    }
}
