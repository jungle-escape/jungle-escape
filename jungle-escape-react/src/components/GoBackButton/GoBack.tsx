import { useNavigate } from "react-router-dom";
import "@/components/Button/button.css";
const GoBack = () => {
  const history = useNavigate();
  return (
    <>
      <button className="button-type-1" onClick={() => history(-1)}>
        뒤로가기
      </button>
    </>
  );
};

export default GoBack;
