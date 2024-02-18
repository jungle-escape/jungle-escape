import BasicBtn from "@/components/Button/BasicButton";
import { GameCloseModalProp } from "@/lib";

/** Modal for Game Closing */
const GameCloseModal = ({
  modalContent,
  handleBlockerProceed,
  handleBlockerReset,
  processMsg,
  resetMsg,
}: GameCloseModalProp) => {
  return (
    <div className="modal-back-container">
      <div className="modal-backdrop">
        <div className="modal-back">
          <p>{modalContent}</p>
          <div className="two-btn-container">
            <BasicBtn
              onClickHandler={handleBlockerProceed}
              btnContent={processMsg}
            />
            <BasicBtn
              onClickHandler={handleBlockerReset}
              btnContent={resetMsg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCloseModal;
