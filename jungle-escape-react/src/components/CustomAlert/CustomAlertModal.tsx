import { ModalProp } from "@/lib";
import "./modal.css";
import BasicBtn from "@/components/Button/BasicButton";

/** Modal for Alert, custumized.  */
const CustomAlert = ({ modalContent, onClickHandler }: ModalProp) => {
  return (
    <>
      <div className="custom-modal-back">
        <div className="custom-modal-container">
          <p>{modalContent}</p>
          <BasicBtn onClickHandler={onClickHandler} btnContent="돌아가기" />
        </div>
      </div>
    </>
  );
};

export default CustomAlert;
