import { parseUnits, formatUnits } from 'ethers';
import { initProvider, rewardTokenContract, signer, threatIntelContract } from '../utils/Web3';
/**
 * Get token information
 */
export const getTokenInfo = async () => {
  try {
    if (signer && (await signer.getAddress()) === "0xDEV_USER_ANONYMOUS") {
      return { name: "DevRewardToken", symbol: "RWT", decimals: 18 };
    }
    if (!rewardTokenContract) await initProvider();

    const [name, symbol, decimals] = await Promise.all([
      rewardTokenContract.name(),
      rewardTokenContract.symbol(),
      rewardTokenContract.decimals()
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals)
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
};

/**
 * Transfer tokens to another address
 */
export const transferTokens = async (toAddress, amount) => {
  try {
    if (!rewardTokenContract) await initProvider();

    const amountWei = parseUnits(amount.toString(), 18);
    const tx = await rewardTokenContract.transfer(toAddress, amountWei);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

export const getRewardTokenAddress = async () => {
  try {
    if (!threatIntelContract) {
      // Simple heuristic for dev bypass
      return "0xDEV_TOKEN_ADDRESS";
    }
    // if (!threatIntelContract) await initProvider(); // Only if we want real one

    if (typeof rewardTokenContract.claimRewards !== 'function') {
      throw new Error('Claim rewards is not supported by the deployed RewardToken contract');
    }
  } catch (error) {
    console.error('Error getting reward token address:', error);
    throw error;
  }
};

/**
 * Claim rewards (if applicable in your contract)
 */
export const claimRewards = async () => {
  try {
    if (!rewardTokenContract) await initProvider();

    if (typeof rewardTokenContract.claimRewards !== 'function') {
      throw new Error('Claim rewards is not supported by the deployed RewardToken contract');
    }

    const tx = await rewardTokenContract.claimRewards();
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error claiming rewards:', error);
    throw error;
  }
};

/**
 * Get pending rewards for an address
 */
export const getPendingRewards = async (address) => {
  try {
    if (address === "0xDEV_USER_ANONYMOUS") return "25.50";
    if (!rewardTokenContract) await initProvider();

    if (typeof rewardTokenContract.pendingRewards !== 'function') {
      return '0';
    }

    const rewards = await rewardTokenContract.pendingRewards(address);
    return formatUnits(rewards, 18);
  } catch (error) {
    console.error('Error getting pending rewards:', error);
    return '0';
  }
};

/**
 * Listen for Transfer events
 */
export const onTransfer = (callback) => {
  if (!rewardTokenContract) {
    console.error('Contract not initialized');
    return;
  }

  rewardTokenContract.on('Transfer', (from, to, value, event) => {
    callback({
      from,
      to,
      value: formatUnits(value, 18),
      transactionHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber
    });
  });
};

/**
 * Remove event listeners
 */
export const removeAllListeners = () => {
  if (rewardTokenContract) {
    rewardTokenContract.removeAllListeners();
  }
};
