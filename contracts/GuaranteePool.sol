// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuaranteePool {
    address public admin;
    uint256 public totalPool;

    mapping(address => uint256) public contributions;

    event PoolFunded(address indexed funder, uint256 amount);
    event PayoutExecuted(address indexed beneficiary, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can execute payouts");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Community / Platform funds the insurance pool
    function fundPool() external payable {
        require(msg.value > 0, "Must send ETH to fund pool");
        contributions[msg.sender] += msg.value;
        totalPool += msg.value;
        emit PoolFunded(msg.sender, msg.value);
    }

    // Execute payout to an aggrieved party in a dispute
    function executeInsurancePayout(address payable beneficiary, uint256 amount) external onlyAdmin {
        require(amount <= totalPool, "Insufficient funds in guarantee pool");
        totalPool -= amount;
        beneficiary.transfer(amount);
        emit PayoutExecuted(beneficiary, amount);
    }
}
