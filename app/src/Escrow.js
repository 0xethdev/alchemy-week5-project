export default function Escrow({
  id,
  receiver,
  amount,
  depositor,
  arbiter,
  released,
  handleRelease,

}) {
  return (
    <div className="lower-container">
      <div className="labels">
        <div className="label">
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </div>
        <div className="label">
          <div> Beneficiary </div>
          <div> {receiver} </div>
        </div>
        <div className="label">
          <div> Value (ETH) </div>
          <div> {amount} </div>
        </div>
        <div
          className="button"
          /*id={address}*/
          onClick={(e) => {
            e.preventDefault();

            handleRelease();
          }}
        >
          Approve
        </div>
      </div>
    </div>
  );
}
