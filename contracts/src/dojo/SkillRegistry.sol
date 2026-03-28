// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillRegistry — Dojo Skill NFT Marketplace
 * @notice ERC-1155 skill NFTs that autonomous workers can purchase.
 *         Creators earn royalties on every sale.
 */
contract SkillRegistry is ERC1155, Ownable, ReentrancyGuard {
    struct Skill {
        address creator;
        string name;
        string description;
        uint256 price;
        uint16 royaltyBps; // basis points (e.g. 500 = 5%)
        uint256 totalBuyers;
        bool exists;
    }

    uint256 public nextSkillId = 1;
    mapping(uint256 => Skill) public skills;
    // agent => list of owned skill ids
    mapping(address => uint256[]) private _agentSkills;
    // agent => skillId => owned
    mapping(address => mapping(uint256 => bool)) public hasSkill;

    event SkillCreated(uint256 indexed skillId, address indexed creator, string name, uint256 price);
    event SkillPurchased(uint256 indexed skillId, address indexed buyer, address indexed creator, uint256 pricePaid);

    constructor() ERC1155("") Ownable(msg.sender) {}

    /// @notice Anyone can create a skill NFT type
    function createSkill(
        string calldata name,
        string calldata description,
        uint256 price,
        uint16 royaltyBps
    ) external returns (uint256 skillId) {
        require(royaltyBps <= 10000, "royalty > 100%");
        skillId = nextSkillId++;
        skills[skillId] = Skill({
            creator: msg.sender,
            name: name,
            description: description,
            price: price,
            royaltyBps: royaltyBps,
            totalBuyers: 0,
            exists: true
        });
        emit SkillCreated(skillId, msg.sender, name, price);
    }

    /// @notice Buy a skill NFT — payment goes to creator (royalty portion) + protocol
    /// @dev C-01 fix: ReentrancyGuard + CEI pattern + M-03 fix: royalty on price not msg.value
    function buySkill(uint256 skillId) external payable nonReentrant {
        Skill storage s = skills[skillId];
        require(s.exists, "skill not found");
        require(!hasSkill[msg.sender][skillId], "already owned");
        require(msg.value >= s.price, "insufficient payment");

        // EFFECTS FIRST (CEI pattern — prevents reentrancy via onERC1155Received)
        hasSkill[msg.sender][skillId] = true;
        _agentSkills[msg.sender].push(skillId);
        s.totalBuyers++;

        // INTERACTIONS
        // Mint ERC-1155 token (callback happens here, but state is already updated)
        _mint(msg.sender, skillId, 1, "");

        // Pay creator royalty (M-03 fix: use s.price, not msg.value)
        uint256 royalty = (s.price * s.royaltyBps) / 10000;
        if (royalty > 0) {
            (bool ok, ) = s.creator.call{value: royalty}("");
            require(ok, "royalty transfer failed");
        }

        // Refund excess
        uint256 excess = msg.value - s.price;
        if (excess > 0) {
            (bool ok2, ) = msg.sender.call{value: excess}("");
            require(ok2, "refund failed");
        }

        emit SkillPurchased(skillId, msg.sender, s.creator, s.price);
    }

    /// @notice Get skill metadata
    function getSkill(uint256 skillId) external view returns (
        address creator,
        string memory name,
        string memory description,
        uint256 price,
        uint16 royaltyBps,
        uint256 totalBuyers
    ) {
        Skill storage s = skills[skillId];
        require(s.exists, "skill not found");
        return (s.creator, s.name, s.description, s.price, s.royaltyBps, s.totalBuyers);
    }

    /// @notice Get all skills owned by an agent
    function getAgentSkills(address agent) external view returns (uint256[] memory) {
        return _agentSkills[agent];
    }

    /// @notice Withdraw protocol fees (non-royalty portion)
    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "withdraw failed");
    }
}
