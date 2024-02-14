import { BtnProps } from "@/lib";
import "./button.css";

/** Button Component for hanving 'onclick handler' */
const BasicBtn = ({ onClickHandler, btnContent }: BtnProps) => {
  return (
    <button className="button-type-1" onClick={onClickHandler}>
      {btnContent}
    </button>
  );
};

export default BasicBtn;
