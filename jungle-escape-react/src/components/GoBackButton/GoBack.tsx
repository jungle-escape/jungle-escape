import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const history = useNavigate();
  return (
    <>
      <button className="backButton" onClick={() => history(-1)}>
        뒤로가기
      </button>
    </>
  );
};

export default GoBack;
