import { Form, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { loginState } from "@/recoil/loginState";
import { api_login } from "@/api/API";

import "./loginform.css";

const LoginForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [loginData, setLoginData] = useRecoilState(loginState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    console.log("handle login 실행 합니다 ");
    e.preventDefault();

    try {
      console.log(id, password);
      const res = await api_login({ id, password, nickname });
      console.log("[LgForm]: res: ", res);
      //store JWT at Localstorage
      //toast.success("로그인 성공!", { autoClose: 1500 });
      const token = res.data.token;
      // const token = "테스트용";
      window.localStorage.setItem("currentUserId", token);
      setLoginData({ ...loginData, isLoggedIn: true, token: token });

      console.info("로그인 성공!");

      navigate("/game");
    } catch (err) {
      console.log(err);
      //toast.error(`에러 발생! ${err}`);
    }
  };

  /** Modal  */

  const OpenModal = () => {
    setIsModalVisible(true);
  };

  const HideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <section className="login-form-container">
      <Form
        className="login-form"
        action="#"
        method="POST"
        onSubmit={handleLogin}
      >
        <div className="login-password-container">
          <section className="title-input-box">
            <label htmlFor="email" className="email-label">
              아이디
            </label>
            <div className="email-input-div">
              <input
                id="id"
                name="id"
                autoComplete="id"
                placeholder="ID"
                required
                className="email-input"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </section>

          {/* <section className="title-input-box">
            <label htmlFor="email" className="email-label">
              닉네임
            </label>
            <div className="email-input-div">
              <input
                id="nickname"
                name="nickname"
                placeholder="별명"
                required
                className="email-input"
                onChange={(e) => setNickName(e.target.value)}
              />
            </div>
          </section> */}

          <section className="title-input-box">
            <div className="pwd-title-box">
              <label htmlFor="password" className="password-label">
                비밀번호
              </label>
              <div className="password-findme">
                <p onClick={OpenModal}>비밀번호 찾기</p>
              </div>
            </div>
            <div className="password-input-div">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="PASSWORD"
                className="password-inpupt"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </section>
        </div>
        <section className="two-btn-container-col">
          <div>
            <button type="submit" className="button-type-3">
              로그인
            </button>
          </div>
          <p className="go-signup">
            회원이 아니신가요?
            <Link to={`../signUp`} className="button-type-3">
              회원가입하기
            </Link>
          </p>
        </section>
      </Form>
      {/* Find Password Modal Component */}
      {isModalVisible && (
        <dialog id="x-modal" className="find-pwd-modal">
          <form method="dialog" className="dialog-close-box">
            <button className="dialog-close" onClick={HideModal}>
              ✕
            </button>
          </form>
          <section className="modal-box">
            <section className="find-pwd-box">
              <h3>비밀번호 찾기</h3>
              <p>가입 시 사용한 아이디를 기입해주세요.</p>
              <Form className="find-password-form" action="#" method="POST">
                <div className="find-password-form-box">
                  <input
                    id="id"
                    name="id"
                    autoComplete="id"
                    placeholder="ID"
                    required
                    className="email-input"
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="button-type-2"
                  style={{ fontSize: "1rem" }}
                >
                  임시 비밀번호 발급
                </button>
              </Form>
            </section>
          </section>
        </dialog>
      )}
    </section>
  );
};

export default LoginForm;
