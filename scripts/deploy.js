const hre = require("hardhat");

async function main() {
  
    const newEscrow = await hre.ethers.deployContract("NewEscrow");
    await newEscrow.deployed();
  
    console.log(
      `Escrow deployed to ${newEscrow.address}`
    );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

