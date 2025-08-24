// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Event {
    event Ping(address sender, uint256 timestamp);

    function ping() public { emit Ping(msg.sender, block.timestamp); }
}