// Contract addresses - Update these after deployment
const env = import.meta.env;

export const CONTRACT_ADDRESSES = {
  // Hardhat Localhost (Chain ID: 31337)
  31337: {
    ThreatIntel: env.VITE_THREAT_INTEL_ADDRESS_LOCAL || env.VITE_THREAT_INTEL_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    RewardToken: env.VITE_REWARD_TOKEN_ADDRESS_LOCAL || env.VITE_REWARD_TOKEN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  },
  // Polygon Amoy Testnet (Chain ID: 80002)
  80002: {
    ThreatIntel: env.VITE_THREAT_INTEL_ADDRESS_AMOY || env.VITE_THREAT_INTEL_ADDRESS || "",
    RewardToken: env.VITE_REWARD_TOKEN_ADDRESS_AMOY || env.VITE_REWARD_TOKEN_ADDRESS || ""
  }
};

// Network configuration
export const NETWORKS = {
  31337: {
    chainId: 31337,
    chainName: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorer: null
  },
  80002: {
    chainId: 80002,
    chainName: "Polygon Amoy Testnet",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorer: "https://amoy.polygonscan.com"
  }
};

// Default network (change based on your deployment)
export const DEFAULT_NETWORK = 31337; // Use 80002 for Amoy

// Get contract addresses for current network
export const getContractAddresses = (chainId) => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[31337];
};

// Get network config for current network
export const getNetworkConfig = (chainId) => {
  return NETWORKS[chainId] || NETWORKS[31337];
};
