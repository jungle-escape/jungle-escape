import { Link } from "react-router-dom";
import "./button.css";
import { BtnTextProps } from "@/lib";

const RoundingButton = ({ btnContent }: BtnTextProps) => {
  return (
    <>
      {/* <Link to={`game`}>진짜버튼</Link> */}
      <div>
        <Link to={`game`} className="button-type-2">
          <span>{btnContent}</span>
        </Link>
      </div>
    </>
  );
};

export default RoundingButton;
