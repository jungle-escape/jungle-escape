import { BasicUILinkProps } from "@/lib";
import { Link } from "react-router-dom";

import { buttonClickSound } from "@/components/BGM/buttonPlaySound";
/** button for Routing, used as UI link */
const BasicUILink = ({ to, btnContent, style }: BasicUILinkProps) => {
  const handleClick = () => {
    buttonClickSound(3);
  };

  return (
    <Link to={to} className="button-type-3" style={style} onClick={handleClick}>
      {btnContent}
    </Link>
  );
};

export default BasicUILink;
