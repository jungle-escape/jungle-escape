import BasicBtn from "@/components/Button/BasicButton";
import { GameCloseModalProp } from "@/lib";

/** Modal for Game Closing */
const GameCloseModal = ({
  modalContent,
  handleBlockerProceed,
  handleBlockerReset,
}: GameCloseModalProp) => {
  return (
    <div className="modal-back-container">
      <div className="modal-backdrop">
        <div className="modal-back">
          <p>{modalContent}</p>
          <div className="two-btn-container">
            <BasicBtn
              onClickHandler={handleBlockerProceed}
              btnContent={"게임 종료하기"}
            />
            <BasicBtn
              onClickHandler={handleBlockerReset}
              btnContent={"게임 돌아가기"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCloseModal;
