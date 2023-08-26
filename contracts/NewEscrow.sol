// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract NewEscrow {

    struct EscrowContract {
        uint id;
        address receiver;
        uint amount;
        address depositor;
        address arbiter;
        bool released;
    }
    uint idTracker = 0;

    event EscrowCreated(EscrowContract);
    event EscrowClosed(EscrowContract);

    //since EscroContract id starts at 0, id will always be equal to escrow position in allEscrows
    EscrowContract[] public allEscrows;
    
	constructor() {
	}

    function createEscrow(address _receiver, address _arbiter) public payable{
       EscrowContract memory newEscrow = EscrowContract(idTracker , _receiver, msg.value , msg.sender, _arbiter, false);
       allEscrows.push(newEscrow);

       emit EscrowCreated(newEscrow);
       idTracker++;
    }

	function release(uint _id) external {
		require( msg.sender == allEscrows[_id].arbiter, "escrow can be released only by arbiter" );
        require( allEscrows[_id].released == false, "already released");
		uint balance = allEscrows[_id].amount;
		(bool sent, ) = payable(allEscrows[_id].receiver).call{value: balance}("");
 		require(sent, "Failed to send Ether");
        allEscrows[_id].amount = 0;
        allEscrows[_id].released = true;

        emit EscrowClosed(allEscrows[_id]);
	}

    function numberEscrows() public view returns(uint) {
        return allEscrows.length;
    }

    function viewEscrows (uint _id) public view returns(EscrowContract memory) {
        return allEscrows[_id];
    }

}
