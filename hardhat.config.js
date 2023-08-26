require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
