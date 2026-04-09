// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Payment {
    event PaymentSent(address indexed from, address indexed to, uint256 amount, string currency);

    // Simple ETH transfer handler
    function sendPayment(address payable _to, string memory _currency) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        _to.transfer(msg.value);
        emit PaymentSent(msg.sender, _to, msg.value, _currency);
    }
}
