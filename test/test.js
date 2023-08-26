const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    [depositor, beneficiary, arbiter] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory('NewEscrow');
    contract = await Escrow.deploy(
    );
    await contract.deployed();
  });

  it('should update balance after escrow creation', async function () {
    await contract.createEscrow(beneficiary.address, arbiter.address, {value:deposit});
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);

  });
  
  it('should emit creation event', async function () {
    let tx = await contract.createEscrow(beneficiary.address, arbiter.address, {value:deposit});
    let receipt = await tx.wait();
    receipt.events?.filter((x) => {return x.event == "EscrowCreated"});

  });

  it('should release by arbiter', async function () {
    await contract.createEscrow(beneficiary.address, arbiter.address, {value:deposit});
    await contract.connect(arbiter).release(0);
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(0);

  });

  it('should not release if wrong caller (depositor)', async function () {
    await contract.createEscrow(beneficiary.address, arbiter.address, {value:deposit});
    await expect(contract.connect(depositor).release(0)).to.be.reverted;

  });

  it('should not release if wrong caller (beneficiary)', async function () {
    await contract.createEscrow(beneficiary.address, arbiter.address, {value:deposit});
    await expect(contract.connect(beneficiary).release(0)).to.be.reverted;

  });
  

});
