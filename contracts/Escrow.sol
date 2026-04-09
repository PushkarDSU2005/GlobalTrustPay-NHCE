// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public client;
    address public freelancer;
    string public projectName;
    
    enum Status { Pending, Funded, Completed, Approved, Disputed, Refunded }
    Status public status;

    uint256 public totalAmount;
    
    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this");
        _;
    }
    
    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this");
        _;
    }

    event Deposited(address indexed client, uint256 amount);
    event Completed(address indexed freelancer);
    event Approved(address indexed client, uint256 amountReleased);
    event Refunded(address indexed client, uint256 amountRefunded);

    constructor(address _freelancer, string memory _projectName) payable {
        client = msg.sender;
        freelancer = _freelancer;
        projectName = _projectName;
        totalAmount = msg.value;
        status = msg.value > 0 ? Status.Funded : Status.Pending;
    }

    function deposit() external payable onlyClient {
        require(status == Status.Pending, "Already funded");
        totalAmount += msg.value;
        status = Status.Funded;
        emit Deposited(msg.sender, msg.value);
    }

    function markComplete() external onlyFreelancer {
        require(status == Status.Funded, "Not funded or already complete");
        status = Status.Completed;
        emit Completed(msg.sender);
    }

    function release() external onlyClient {
        require(status == Status.Completed || status == Status.Funded, "Work not completed/funded");
        status = Status.Approved;
        uint256 amount = address(this).balance;
        payable(freelancer).transfer(amount);
        emit Approved(msg.sender, amount);
    }

    function refund() external onlyClient {
        require(status == Status.Funded || status == Status.Completed, "Cannot refund at this stage");
        status = Status.Refunded;
        uint256 amount = address(this).balance;
        payable(client).transfer(amount);
        emit Refunded(msg.sender, amount);
    }
}
