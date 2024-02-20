import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginState } from "@/recoil/loginState";

import JungleLogo from "@/assets/jungle-logo.svg?react";
import "./landing.css";
import LoginForm from "@/components/Login/LoginForm";

const LandingPage = () => {
  const loginData = useRecoilValue(loginState);

  return (
    <>
      <main className="box">
        <section className="center-div">
          <div className="center-div center-div-animation">
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
        </section>
        <section className="login-form-animation">
          {loginData.isLoggedIn ? (
            <>
              <div className="two-btn-container-col">
                <Link
                  to={`game`}
                  className="button-type-3"
                  style={{
                    fontSize: "2rem",
                    width: "15rem",
                    color: "var(--color_DarkerGreen)",
                  }}
                >
                  {" "}
                  게임하기
                </Link>
                <Link
                  to={`ranking`}
                  className="button-type-3"
                  style={{ fontSize: "2rem", width: "15rem" }}
                >
                  {" "}
                  렝킹보기
                </Link>
              </div>
            </>
          ) : (
            <>
              <LoginForm />
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default LandingPage;
