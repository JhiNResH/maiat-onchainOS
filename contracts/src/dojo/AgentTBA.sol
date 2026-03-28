// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./SkillRegistry.sol";

/**
 * @title AgentTBA — ERC-6551 Token Bound Account for Agents
 * @notice Each agent is an ERC-721 NFT with a deterministic TBA (Token Bound Account).
 *         Skills (ERC-1155) are equipped by transferring them to the agent's TBA.
 * @dev Simplified ERC-6551 pattern — deterministic address derived from (chainId, tokenContract, tokenId, salt).
 *      Full ERC-6551 registry integration for production.
 */
contract AgentTBA is ERC721, Ownable {
    struct Agent {
        string name;
        address tbaAddress; // Token Bound Account address
        uint256[] equippedSkills;
        bool exists;
    }

    SkillRegistry public immutable skillRegistry;

    uint256 public nextAgentId = 1;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public ownerToAgent; // 1 agent per owner for simplicity

    // ERC-6551 Registry (simplified)
    // In production: use the canonical ERC-6551 Registry at 0x000000006551c19487814612e58FE06813775758
    address public constant ERC6551_REGISTRY = address(0);

    event AgentCreated(uint256 indexed agentId, address indexed owner, string name, address tbaAddress);
    event SkillEquipped(uint256 indexed agentId, uint256 indexed skillId);
    event SkillUnequipped(uint256 indexed agentId, uint256 indexed skillId);

    constructor(address _skillRegistry) ERC721("Maiat Agent", "MAGENT") Ownable(msg.sender) {
        skillRegistry = SkillRegistry(_skillRegistry);
    }

    /// @notice Create an agent NFT with a deterministic TBA
    function createAgent(string calldata name) external returns (uint256 agentId) {
        require(ownerToAgent[msg.sender] == 0, "already has agent");

        agentId = nextAgentId++;
        
        // Mint ERC-721 agent NFT
        _mint(msg.sender, agentId);

        // Compute deterministic TBA address (simplified ERC-6551)
        address tba = _computeTBA(agentId);

        agents[agentId] = Agent({
            name: name,
            tbaAddress: tba,
            equippedSkills: new uint256[](0),
            exists: true
        });
        ownerToAgent[msg.sender] = agentId;

        emit AgentCreated(agentId, msg.sender, name, tba);
    }

    /// @notice Equip a skill NFT to an agent (must own both agent and skill)
    function equipSkill(uint256 agentId, uint256 skillId) external {
        require(ownerOf(agentId) == msg.sender, "not agent owner");
        require(agents[agentId].exists, "agent not found");
        require(skillRegistry.balanceOf(msg.sender, skillId) > 0, "skill not owned");

        // Check not already equipped
        uint256[] storage equipped = agents[agentId].equippedSkills;
        for (uint256 i = 0; i < equipped.length; i++) {
            require(equipped[i] != skillId, "already equipped");
        }

        equipped.push(skillId);

        // Transfer skill to TBA (in production: actual ERC-1155 safeTransferFrom)
        // For hackathon: track equipped state, skip actual transfer to keep it simple

        emit SkillEquipped(agentId, skillId);
    }

    /// @notice Unequip a skill NFT from an agent
    function unequipSkill(uint256 agentId, uint256 skillId) external {
        require(ownerOf(agentId) == msg.sender, "not agent owner");
        
        uint256[] storage equipped = agents[agentId].equippedSkills;
        bool found = false;
        for (uint256 i = 0; i < equipped.length; i++) {
            if (equipped[i] == skillId) {
                equipped[i] = equipped[equipped.length - 1];
                equipped.pop();
                found = true;
                break;
            }
        }
        require(found, "skill not equipped");

        emit SkillUnequipped(agentId, skillId);
    }

    /// @notice Get agent profile
    function getAgent(uint256 agentId) external view returns (
        string memory name,
        address owner_,
        address tbaAddress,
        uint256[] memory equippedSkills
    ) {
        require(agents[agentId].exists, "agent not found");
        Agent storage a = agents[agentId];
        return (a.name, ownerOf(agentId), a.tbaAddress, a.equippedSkills);
    }

    /// @notice Get agent by owner address
    function getAgentByOwner(address owner_) external view returns (uint256) {
        return ownerToAgent[owner_];
    }

    /// @notice M-01 fix: Update ownerToAgent mapping on NFT transfer
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0)) delete ownerToAgent[from];
        if (to != address(0)) ownerToAgent[to] = tokenId;
        return from;
    }

    /// @notice Compute deterministic TBA address (simplified ERC-6551)
    /// @dev In production: call ERC-6551 Registry.account() for canonical address
    function _computeTBA(uint256 agentId) internal view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(
            block.chainid,
            address(this),
            agentId,
            uint256(0) // salt
        )))));
    }
}
