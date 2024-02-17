import JungleLogo from "@/assets/jungle-logo.svg?react";
import "./landing.css";
import RoundingButton from "@/components/Button/RoundingButton";

const LandingPage = () => {
  return (
    <>
      <div className="box">
        <div className="center-div">
          <JungleLogo
            width={"60%"}
            height={"90%"}
            viewBox={"50 50 150 150"}
            style={{
              borderRadius: "20px",
              boxShadow: "10px 10px 5px rgb(0, 0, 0, 0.2)",
            }}
          />
        </div>
        <div className="btn-box">
          <RoundingButton btnContent={"로그인"} />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
