// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "./Ownable.sol";

contract Counter is Ownable{
    uint256 public number;

    event Mention(address indexed caller);

    constructor() Ownable(msg.sender) {}

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function fromGroup1Address() public {
        emit Mention(msg.sender);
    }

    function fromGroup2Address() public {
        emit Mention(msg.sender);
    }

    function hiTo(address someone) public {
        emit Mention(someone);
    }

    receive() external payable {}
}
