import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config({ path: "contracts/.env" });

export default {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
