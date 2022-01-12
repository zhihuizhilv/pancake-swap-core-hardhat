import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    ganache: {
      url: "http://localhost:8545",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    bsc_testnet: {
      url: process.env.HARDHAT_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/",
      gas: 8000000,
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    bsc: {
      url: process.env.HARDHAT_RPC || "https://bsc-dataseed4.binance.org/",
      gas: 8000000,
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
