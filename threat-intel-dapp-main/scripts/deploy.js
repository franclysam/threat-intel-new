import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Deploy Reward Token
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();

  console.log("RewardToken deployed to:", await rewardToken.getAddress());

  // Deploy ThreatIntel contract
  const ThreatIntel = await ethers.getContractFactory("ThreatIntel");
  const threatIntel = await ThreatIntel.deploy(await rewardToken.getAddress());
  await threatIntel.waitForDeployment();

  console.log("ThreatIntel deployed to:", await threatIntel.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
