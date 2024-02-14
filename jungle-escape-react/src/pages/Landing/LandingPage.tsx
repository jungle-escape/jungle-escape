import JungleLogo from "@/assets/jungle-logo.svg?react";
import "./landing.css";
import RoundingButton from "@/components/Button/RoundingButton";

const LandingPage = () => {
  return (
    <>
      <div className="box">
        <div className="center-div">
          <JungleLogo width={"70%"} height={"70%"} viewBox={"0 0 250 250"} />
        </div>
        <div className="btn-box">
          <RoundingButton btnContent={"게임하기"} />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
