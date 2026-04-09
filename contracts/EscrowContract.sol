// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EscrowContract {
    address public client;
    address public freelancer;
    uint256 public amount;
    
    bool public isCompleted;
    bool public isApproved;

    string public projectName;

    event Deposited(address indexed client, uint256 amount);
    event WorkCompleted(address indexed freelancer);
    event PaymentApproved(address indexed client);
    event FundsReleased(address indexed freelancer, uint256 amount);

    constructor(address _freelancer, string memory _projectName) payable {
        client = msg.sender;
        freelancer = _freelancer;
        projectName = _projectName;
        amount = msg.value;

        if(msg.value > 0) {
            emit Deposited(client, msg.value);
        }
    }

    // fallback in case they want to deposit later
    function deposit() external payable {
        require(msg.sender == client, "Only client can deposit");
        amount += msg.value;
        emit Deposited(client, msg.value);
    }

    function markComplete() external {
        require(msg.sender == freelancer, "Only freelancer can mark complete");
        require(!isCompleted, "Already marked as complete");
        isCompleted = true;
        emit WorkCompleted(freelancer);
    }

    function approvePayment() external {
        require(msg.sender == client, "Only client can approve");
        require(isCompleted, "Work is not marked as complete yet");
        require(!isApproved, "Already approved");
        isApproved = true;
        emit PaymentApproved(client);
    }

    function releaseFunds() external {
        require(isApproved, "Payment must be approved first");
        require(amount > 0, "No funds to release");
        
        uint256 transferAmount = amount;
        amount = 0; // Prevent re-entrancy
        
        (bool success, ) = freelancer.call{value: transferAmount}("");
        require(success, "Transfer failed");

        emit FundsReleased(freelancer, transferAmount);
    }
}
