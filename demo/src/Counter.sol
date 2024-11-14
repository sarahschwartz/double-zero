// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    event Mention(address caller);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function fromOneAddress() public {
        emit Mention(msg.sender);
    }

    function fromAnotherAddress() public {
        emit Mention(msg.sender);
    }

    function hiTo(address someone) public {
        emit Mention(someone);
    }
}
