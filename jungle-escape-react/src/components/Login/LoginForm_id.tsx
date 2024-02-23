import { useState } from "react";
import { Form, useNavigate, Link } from "react-router-dom";

import { useRecoilState } from "recoil";
import { loginState } from "@/recoil/loginState";
import { musicState } from "@/recoil/musicState";

import { api_login } from "@/api/API";

import axios from "axios";

import "./loginform.css";
import { buttonClickSound } from "@/components/BGM/buttonPlaySound";
import CustomAlert from "@/components/CustomAlert/CustomAlertModal";

import ReactDOM from "react-dom";

const LoginForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [loginData, setLoginData] = useRecoilState(loginState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [musicData, setMusicData] = useRecoilState(musicState);

  const [alertMessage, setAlertMessage] = useState("");

  //for dev
  // const [isEnglish, setIsEnglish] = useState(true);
  // const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /// for PRODUCTION //////

      const res = await api_login({ id, password });
      //store JWT at Localstorage
      const token = res.data.token;
      window.localStorage.setItem("currentUserId", token);
      setLoginData({ ...loginData, isLoggedIn: true, token: token });
      setMusicData({ ...musicData, isPlay: true }); //music on

      console.info(`ID: ${id} | LOGIN SUCCESS`);

      navigate("/game");

      //// for DEV ////
      // if (validateEnglish(nickname)) {
      //   const token = crypto.randomUUID();
      //   window.localStorage.setItem("nickname", nickname);
      //   setLoginData({ ...loginData, isLoggedIn: true, token: token });
      //   setMusicData({ ...musicData, isPlay: true }); //music on

      //   //console.info(`ID: ${id} | LOGIN SUCCESS`);
      //   console.info(`nickname: ${nickname} | CONNECT SUCCESS`);

      //   navigate("/game");
      // } else if (!validateEnglish(nickname)) {
      //   setIsEnglish(false);
      //   return;
      // }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        // Extracting message from the error response object
        const errorMessage = err.response.data.message || "로그인 오류 발생";
        setAlertMessage(errorMessage);
        setIsModalVisible(true);
      } else {
        // Fallback error message for non-Axios errors
        setAlertMessage("알 수 없는 오류가 발생했습니다.");
        setIsModalVisible(true);
      }
    }
  };

  //// handle nickname functions : for dev ///

  // const validateEnglish = (value: string) => {
  //   const regex = /^[A-Za-z]+$/;
  //   if (regex.test(value)) {
  //     //console.log("Valid value:", value);
  //     return true;
  //   }
  //   //console.log("Invalid value:", value);
  //   return false;
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   const isValidEnglish = validateEnglish(value);

  //   setIsEnglish(isValidEnglish);
  //   if (isValidEnglish || value === "") {
  //     setNickname(value);
  //     setIsEnglish(true);
  //   } else if (!isValidEnglish) {
  //     setIsEnglish(false);
  //   }
  // };

  /** Modal  */

  const handleCloseModals = () => {
    buttonClickSound(1);
    setIsModalVisible(false);
    setAlertMessage("");
  };
  const modalRoot = document.getElementById("modal-root");
  // for custumized alert modal
  const customAlertModal =
    isModalVisible && modalRoot
      ? ReactDOM.createPortal(
          <CustomAlert
            modalContent={alertMessage}
            onClickHandler={handleCloseModals}
          />,
          modalRoot
        )
      : null;

  return (
    <section className="login-form-container">
      <Form
        className="login-form"
        action="#"
        method="POST"
        onSubmit={handleLogin}
      >
        <div className="login-password-container">
          {/* FOR DEV
          <section className="title-input-box">
            <label htmlFor="email" id="nickname-label">
              닉네임을 지어주세요
            </label>
            <div className="email-input-div">
              <input
                id="nickname"
                name="nickname"
                placeholder="영어로 입력해주세요!"
                required
                className="email-input"
                onChange={handleInputChange}
              />
            </div>
            <p id="nickname-error" className={!isEnglish ? "show" : "hide"}>
              공백을 제외한 영문자만 사용해주세요!
            </p>
          </section> */}

          <section className="title-input-box">
            <label htmlFor="email" className="id-label">
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
            <label htmlFor="email" id="nickname-label">
              닉네임을 지어주세요
            </label>
            <div className="email-input-div">
              <input
                id="nickname"
                name="nickname"
                placeholder="영어로 입력해주세요!"
                required
                className="email-input"
                onChange={handleInputChange}
              />
            </div>
            <p id="nickname-error" className={!isEnglish ? "show" : "hide"}>
              공백을 제외한 영문자만 사용해주세요!
            </p>
          </section> */}

          <section className="title-input-box">
            <div className="pwd-title-box">
              <label htmlFor="password" className="password-label">
                비밀번호
              </label>
              {/* <div className="password-findme">
                <p onClick={OpenModal} id="find-pwd">
                  비밀번호 찾기
                </p>
              </div> */}
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
            <button
              type="submit"
              className="button-type-3"
              onClick={() => {
                buttonClickSound(3);
                // handleLogin;
              }}
            >
              {/* 로그인 */}
              게임하기
            </button>
          </div>
          <p className="go-signup">
            <span id="not-user">회원이 아니신가요?</span>
            <Link
              to={`../signUp`}
              className="button-type-3"
              onClick={() => {
                buttonClickSound(3);
              }}
            >
              회원가입
            </Link>
          </p>
        </section>
      </Form>
      {/* Find Password Modal Component */}
      {/* {isModalVisible && (
        <dialog id="x-modal" className="find-pwd-modal">
          <form method="dialog" className="dialog-close-box">
            <button className="dialog-close" onClick={HideModal}>
              ✕
            </button>
          </form>
          <section className="modal-box">
            <section className="find-pwd-box">
              <h3>비밀번호 찾기</h3>
              <span className="span-findId ">
                가입 시 사용한 아이디를 기입해주세요.
              </span>
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
      )} */}
      {/* {isModalVisible && (
        <div className="custom-modal-container">
          <p>{alertMessage}</p>
          <BasicBtn onClickHandler={handleCloseModals} btnContent="돌아가기" />
        </div>
      )} */}
      {customAlertModal}
    </section>
  );
};

export default LoginForm;
