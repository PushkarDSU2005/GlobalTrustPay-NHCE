// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Reputation {
    address public owner;

    struct UserReputation {
        uint256 score;
        uint256 completedJobs;
        uint256 disputes;
    }

    mapping(address => UserReputation) public reputations;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update scores");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Initialize or modify a user's score based on external ML/AI metrics
    function updateScore(address user, uint256 newScore, bool jobSuccess) external onlyOwner {
        require(newScore <= 100, "Score max is 100");
        reputations[user].score = newScore;
        
        if (jobSuccess) {
            reputations[user].completedJobs += 1;
        } else {
            reputations[user].disputes += 1;
        }
    }

    function getReputation(address user) external view returns (uint256, uint256, uint256) {
        UserReputation memory rep = reputations[user];
        return (rep.score, rep.completedJobs, rep.disputes);
    }
}
