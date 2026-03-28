// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/core/ReputationEngine.sol";
import "../src/dojo/SkillRegistry.sol";
import "../src/core/JobMarket.sol";
import "../src/core/TrustScoreOracle.sol";
import "../src/identity/AgentIdentity.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy ReputationEngine
        ReputationEngine reputationEngine = new ReputationEngine();

        // 2. Deploy SkillRegistry (Dojo)
        SkillRegistry skillRegistry = new SkillRegistry();

        // 3. Deploy JobMarket
        JobMarket jobMarket = new JobMarket(
            address(reputationEngine),
            address(skillRegistry)
        );

        // 4. Authorize JobMarket to update reputation
        reputationEngine.setAuthorizedCaller(address(jobMarket), true);

        // 5. Deploy TrustScoreOracle
        TrustScoreOracle oracle = new TrustScoreOracle(msg.sender);

        // 6. Deploy AgentIdentity
        AgentIdentity identity = new AgentIdentity(msg.sender);

        vm.stopBroadcast();

        console.log("=== Maiat XLayer Deployment ===");
        console.log("ReputationEngine:", address(reputationEngine));
        console.log("SkillRegistry:   ", address(skillRegistry));
        console.log("JobMarket:       ", address(jobMarket));
        console.log("TrustScoreOracle:", address(oracle));
        console.log("AgentIdentity:   ", address(identity));
    }
}
