import TypoLoader from "@/components/Loading/TypoLoader";
import { useNavigate } from "react-router-dom";
const TestPage = () => {
  const navigate = useNavigate();

  const onclickhandler = () => {
    navigate("/result", {
      state: {
        rankingList: [["기타", "Tester", "기타"]],
        endtime: "10:10:20",
      },
    });
  };
  return (
    <>
      <TypoLoader />
      <div>
        <button
          className="button-type-3"
          onClick={onclickhandler}
          style={{ zIndex: "1500" }}
        >
          랭킹으로
        </button>
      </div>
    </>
  );
};

export default TestPage;
