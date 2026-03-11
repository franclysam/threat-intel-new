// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ThreatIntel is Ownable {
    IERC20 public immutable rewardToken;

    event ReportSubmitted(address indexed reporter, string ipfsHash);
    event ReporterRewarded(address indexed reporter, uint256 amount);

    constructor(address rewardTokenAddress) Ownable(msg.sender) {
        require(rewardTokenAddress != address(0), "reward token is zero");
        rewardToken = IERC20(rewardTokenAddress);
    }

    function submitReport(string calldata ipfsHash) external {
        require(bytes(ipfsHash).length != 0, "empty report");
        emit ReportSubmitted(msg.sender, ipfsHash);
    }

    // Owner can reward reporters from tokens held by this contract.
    function rewardReporter(address reporter, uint256 amount) external onlyOwner {
        require(reporter != address(0), "reporter is zero");
        require(rewardToken.transfer(reporter, amount), "reward transfer failed");
        emit ReporterRewarded(reporter, amount);
    }
}
