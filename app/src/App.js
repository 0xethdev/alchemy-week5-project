import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';
import Contract_Artif from "./artifacts/contracts/NewEscrow.sol/NewEscrow.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const address = ''; // CONTRACT ADDRESS TO BE ADDED
const newEscrow = new ethers.Contract(address, Contract_Artif.abi,provider)

export async function release(newEscrow, signer, id) {
  const approveTxn = await newEscrow.connect(signer).release(id);
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    window.ethereum?.request({method: 'eth_accounts'}).then((accounts) => {
      setAccount(accounts[0])
    });

    window.ethereum?.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });
  }, []);

  useEffect(() => {
    if (account) {
      setSigner(new ethers.providers.Web3Provider(window.ethereum).getSigner());
    }
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const escrowAmount = ethers.BigNumber.from(ethers.utils.parseEther(document.getElementById('eth').value));
    
    await newEscrow.connect(signer).createEscrow(beneficiary, arbiter,{ value:escrowAmount });    
    await retrieveEscrows();

  }

  async function retrieveEscrows() {

    let escrowLength = await newEscrow.connect(signer).numberEscrows();
    let escrowEvents = await newEscrow.connect(signer).viewEscrows(escrowLength-1);
    let relevantID = escrowEvents.id.toString();
    
    const escrow = {
      id: relevantID,
      receiver: escrowEvents.receiver,
      amount: ethers.utils.formatEther(escrowEvents.amount),
      depositor: escrowEvents.depositor,
      arbiter: escrowEvents.arbiter,
      released: escrowEvents.released,
      handleRelease: async () => {
        newEscrow.on('EscrowClosed', () => {
          document.getElementById(newEscrow.id).innerText =
            "✓ It's been released!";
        });

        await release(newEscrow, signer, relevantID);
      },
    };

    setEscrows([...escrows, escrow]);
  
  }


  /* ------------------------------------------------------ */

  return (
    <div className="container">
      <div className="section">
        <h2 className="section-title"> Create New Escrow Contract </h2>
        <div className="labels">
          <div className="label">
            Arbiter Address
            <input type="text" className="input-field" id="arbiter" />
          </div>

          <div className="label">
            Beneficiary Address
              <input type="text" className="input-field" id="beneficiary" />
          </div>

          <div className="label">
            Deposit Amount (ETH)
              <input type="text" className="input-field" id="eth" />
          </div>
        </div>
        
        <div
          className="button"
          id="create"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Create Escrow
        </div>
      </div>

      <div className="section">
        <h2 className="section-title"> Existing Contracts </h2>

        <div id="container" className="lower-container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.id} {...escrow} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
