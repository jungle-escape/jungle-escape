import { Link } from "react-router-dom";
import "./button.css";
import { BtnTextProps } from "@/lib";

/** button for link to 'game' page. */
const RoundingButton = ({ btnContent }: BtnTextProps) => {
  return (
    <>
      <div>
        <Link to={`game`} className="button-type-2">
          <span>{btnContent}</span>
        </Link>
      </div>
    </>
  );
};

export default RoundingButton;
