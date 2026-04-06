import { getRewards, claimRewardsAPI, transferTokensAPI, getTransactions } from './Apiservice';

/**
 * Get token information (mocked)
 */
export const getTokenInfo = async () => {
  return { name: "SentinelToken", symbol: "RWT", decimals: 18 };
};

/**
 * Transfer tokens to another address
 */
export const transferTokens = async (fromAddress, toAddress, amount) => {
  try {
    const data = await transferTokensAPI(fromAddress, toAddress, amount);
    return {
      success: true,
      txHash: data.transactionHash
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

export const getRewardTokenAddress = async () => {
  return "0xMOCK_TOKEN_ADDRESS_FOR_SIMULATION";
};

/**
 * Claim rewards
 */
export const claimRewards = async (wallet) => {
  try {
    const data = await claimRewardsAPI(wallet);
    return {
      success: true,
      txHash: data.transactionHash
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
    const rewards = await getRewards(address);
    return String(rewards.pendingTokens || 0);
  } catch (error) {
    console.error('Error getting pending rewards:', error);
    return '0';
  }
};

/**
 * Get transaction history from mock ledger
 */
export const getUserTransactions = async (address) => {
  try {
    return await getTransactions(address);
  } catch (err) {
    console.error('Error getting transactions', err);
    return [];
  }
};

/**
 * Empty functions since there's no smart contract events anymore
 */
export const onTransfer = (callback) => {
  // Empty mock
};
export const removeAllListeners = () => {
  // Empty mock
};
