const ethers = require('ethers');
require('dotenv').config();
const hre = require("hardhat");

async function main() {

  const url = process.env.GOERLI_URL;
  let artifacts = await hre.artifacts.readArtifact("NewEscrow");
  const provider = new ethers.providers.JsonRpcProvider(url);
  let privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let caller = await factory.deploy();
  await caller.deployed();

  console.log("Caller address:", caller.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});