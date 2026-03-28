// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./dojo/AgentTBA.sol";
import "./identity/AgentIdentity.sol";

/**
 * @title AgentFactory — One-Click Agent Registration
 * @notice Creates AgentTBA (ERC-721 + ERC-6551 TBA) + AgentIdentity (ERC-8004) in a single tx.
 *         User calls registerAgent() once → gets both NFT agent + on-chain identity.
 */
contract AgentFactory {
    AgentTBA public immutable agentTBA;
    AgentIdentity public immutable agentIdentity;

    event AgentFullyRegistered(
        address indexed owner,
        uint256 indexed tbaAgentId,
        uint256 indexed identityAgentId,
        address tbaAddress,
        string name
    );

    constructor(address _agentTBA, address _agentIdentity) {
        require(_agentTBA != address(0) && _agentIdentity != address(0), "zero address");
        agentTBA = AgentTBA(_agentTBA);
        agentIdentity = AgentIdentity(_agentIdentity);
    }

    /// @notice One-click: create agent NFT (TBA) + register identity (ERC-8004)
    /// @param name Agent display name
    /// @param agentURI Metadata URI for ERC-8004 identity (e.g. ipfs://... or data URI)
    /// @return tbaAgentId The ERC-721 agent token ID
    /// @return identityAgentId The ERC-8004 identity ID
    /// @return tbaAddress The deterministic Token Bound Account address
    function registerAgent(
        string calldata name,
        string calldata agentURI
    ) external returns (uint256 tbaAgentId, uint256 identityAgentId, address tbaAddress) {
        // 1. Create agent NFT + TBA (ERC-6551) — minted to msg.sender
        tbaAgentId = agentTBA.createAgentFor(msg.sender, name);

        // 2. Get the TBA address
        (, , tbaAddress, ) = agentTBA.getAgent(tbaAgentId);

        // 3. Register on-chain identity (ERC-8004)
        //    Note: AgentIdentity.register() uses msg.sender, so we need registerFor()
        //    The factory must be authorized or we register on behalf of the user
        identityAgentId = agentIdentity.registerFor(msg.sender, agentURI);

        emit AgentFullyRegistered(msg.sender, tbaAgentId, identityAgentId, tbaAddress, name);
    }

    /// @notice Check if an address is fully registered (both TBA + identity)
    function isFullyRegistered(address account) external view returns (bool hasTBA, bool hasIdentity) {
        hasTBA = agentTBA.getAgentByOwner(account) != 0;
        hasIdentity = agentIdentity.isRegistered(account);
    }
}
