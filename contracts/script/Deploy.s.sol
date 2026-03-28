// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "forge-std/Script.sol";
import "../src/core/ReputationEngine.sol";
import "../src/dojo/SkillRegistry.sol";
import "../src/dojo/AgentTBA.sol";
import "../src/core/JobMarket.sol";
import "../src/core/TrustScoreOracle.sol";
import "../src/identity/AgentIdentity.sol";
import "../src/AgentFactory.sol";
import "../src/acp/MaiatEvaluator.sol";
import "../src/acp/EvaluatorRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
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

        // 5. Deploy AgentTBA (ERC-6551)
        AgentTBA agentTBA = new AgentTBA(address(skillRegistry));

        // 6. Deploy TrustScoreOracle
        TrustScoreOracle oracle = new TrustScoreOracle(deployer);

        // 7. Deploy AgentIdentity
        AgentIdentity identity = new AgentIdentity(deployer);

        // 8. Deploy AgentFactory (one-click registration)
        AgentFactory factory = new AgentFactory(address(agentTBA), address(identity));

        // 9. H-04 fix: Authorize factory on both AgentTBA and AgentIdentity
        agentTBA.setAuthorizedFactory(address(factory), true);
        identity.setAuthorizedFactory(address(factory), true);

        // 10. Deploy MaiatEvaluator (ERC-8183)
        MaiatEvaluator evaluator = new MaiatEvaluator(
            address(oracle),
            60,      // default threshold
            3,       // threat threshold
            deployer
        );

        // 11. Deploy EvaluatorRegistry with MaiatEvaluator as default
        EvaluatorRegistry evalRegistry = new EvaluatorRegistry(
            address(evaluator),
            deployer
        );

        // 12. Set up domain evaluators (all point to MaiatEvaluator for hackathon,
        //     but with different thresholds per domain)
        evalRegistry.setEvaluator(1, address(evaluator), "Security", 80);
        evalRegistry.setEvaluator(2, address(evaluator), "DeFi", 70);
        evalRegistry.setEvaluator(3, address(evaluator), "Content", 50);

        // 13. Seed demo skills on SkillRegistry
        skillRegistry.createSkill("Smart Contract Audit", "Security auditing for smart contracts", 0.001 ether, 1000);
        skillRegistry.createSkill("DeFi Strategy", "DeFi yield optimization and risk analysis", 0.001 ether, 500);
        skillRegistry.createSkill("Content Creation", "Technical writing and marketing content", 0.0005 ether, 500);
        skillRegistry.createSkill("Frontend Development", "React/Next.js UI development", 0.001 ether, 750);

        vm.stopBroadcast();

        console.log("=== Maiat XLayer Deployment ===");
        console.log("Network: XLayer Mainnet (ChainID 196)");
        console.log("Deployer:         ", deployer);
        console.log("---");
        console.log("ReputationEngine: ", address(reputationEngine));
        console.log("SkillRegistry:    ", address(skillRegistry));
        console.log("AgentTBA:         ", address(agentTBA));
        console.log("JobMarket:        ", address(jobMarket));
        console.log("TrustScoreOracle: ", address(oracle));
        console.log("AgentIdentity:    ", address(identity));
        console.log("AgentFactory:     ", address(factory));
        console.log("MaiatEvaluator:   ", address(evaluator));
        console.log("EvaluatorRegistry:", address(evalRegistry));
        console.log("---");
        console.log("Demo skills seeded: 4 (Audit, DeFi, Content, Frontend)");
        console.log("Factory authorized on AgentTBA + AgentIdentity");
    }
}
