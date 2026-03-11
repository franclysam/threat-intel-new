import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { getContractAddresses, getNetworkConfig } from '../config/Contracts';
import { ThreatIntelABI } from '../config/Threatintelabi';
import { RewardTokenABI } from '../config/Rewardtokenabi';

let provider = null;
let signer = null;
let threatIntelContract = null;
let rewardTokenContract = null;
let currentChainId = null;

/**
 * Initialize Web3 provider with MetaMask
 */
export const initProvider = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    provider = new BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    signer = await provider.getSigner();

    const network = await provider.getNetwork();
    currentChainId = Number(network.chainId);

    const addresses = getContractAddresses(currentChainId);

    if (!addresses.ThreatIntel || !addresses.RewardToken) {
      throw new Error(`Contracts not deployed on network ${currentChainId}. Please deploy contracts or switch network.`);
    }

    threatIntelContract = new Contract(addresses.ThreatIntel, ThreatIntelABI, signer);
    rewardTokenContract = new Contract(addresses.RewardToken, RewardTokenABI, signer);

    console.log('Web3 initialized on chain:', currentChainId);
    console.log('ThreatIntel:', addresses.ThreatIntel);
    console.log('RewardToken:', addresses.RewardToken);

    return { provider, signer, chainId: currentChainId };
  } catch (error) {
    console.error('Error initializing provider:', error);
    throw error;
  }
};

export const connectWallet = async () => {
  try {
    await initProvider();
    const address = await signer.getAddress();

    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) {
      throw new Error('Unsupported network. Please switch to Hardhat Local or Polygon Amoy.');
    }

    console.log(`Connected to ${networkConfig.chainName} (Chain ID: ${chainId})`);

    return address;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const switchNetwork = async (chainId) => {
  try {
    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) {
      throw new Error('Network not supported');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await addNetwork(chainId);
    } else {
      throw switchError;
    }
  }
};

export const addNetwork = async (chainId) => {
  try {
    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) {
      throw new Error('Network not supported');
    }

    const params = {
      chainId: `0x${chainId.toString(16)}`,
      chainName: networkConfig.chainName,
      rpcUrls: [networkConfig.rpcUrl],
      nativeCurrency: networkConfig.nativeCurrency,
    };

    if (networkConfig.blockExplorer) {
      params.blockExplorerUrls = [networkConfig.blockExplorer];
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });
  } catch (error) {
    console.error('Error adding network:', error);
    throw error;
  }
};

export const getAddress = async () => {
  if (!signer) await initProvider();
  return await signer.getAddress();
};

export const getBalance = async (address) => {
  if (address === "0xDEV_USER_ANONYMOUS") return "100.0000";
  if (!provider) await initProvider();
  const balance = await provider.getBalance(address);
  return formatUnits(balance, 18);
};

export const getTokenBalance = async (address) => {
  if (address === "0xDEV_USER_ANONYMOUS") return "5000.0000";
  if (!rewardTokenContract) await initProvider();
  const balance = await rewardTokenContract.balanceOf(address);
  return formatUnits(balance, 18);
};

export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        callback(null);
      } else {
        callback(accounts[0]);
      }
    });
  }
};

export const onChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(parseInt(chainId, 16));
    });
  }
};

export const disconnectWallet = () => {
  provider = null;
  signer = null;
  threatIntelContract = null;
  rewardTokenContract = null;
};

export const getContracts = () => ({
  threatIntel: threatIntelContract,
  rewardToken: rewardTokenContract,
});

export { provider, signer, threatIntelContract, rewardTokenContract };
