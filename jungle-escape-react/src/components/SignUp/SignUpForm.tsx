import { useEffect, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { api_signUp } from "@/api/API";

import { useRecoilValue } from "recoil";
import { loginState } from "@/recoil/loginState";

import "./signupfrom.css";

import { buttonClickSound } from "@/components/BGM/buttonPlaySound";
import BasicUILink from "@/components/Button/BasicUILink";

const SignUpForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [isEnglish, setIsEnglish] = useState(true);
  const [isIdRight, setIsIdRight] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loginData = useRecoilValue(loginState);
  const navigate = useNavigate();

  useEffect(() => {
    //로그인 상태일 시 메인으로.
    if (loginData.isLoggedIn) {
      navigate("/");
    }
  }, []);

  /** handling functions */

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!validateEnglish(nickname)) {
        setAlertMessage("닉네임 양식을 확인해주세요");
        OpenModal();
        return;
      }
      if (!validateIDform(id)) {
        setAlertMessage("아이디 양식을 확인해주세요");
        OpenModal();
        return;
      }

      const res = await api_signUp({ id, password, nickname });

      console.info(
        `ID: ${id}/${res.data.id}/${res.data.nickname} | SIGNUP SUCCESS`
      );

      OpenModal();
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "가입 중 오류 발생, 새로고침 해주세요!";
        setAlertMessage(errorMessage);
        OpenModal();
      } else {
        setAlertMessage("알 수 없는 오류가 발생했습니다.");
        OpenModal();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "nickname") {
      const isValidEnglish = validateEnglish(value);

      setIsEnglish(isValidEnglish);
      if (isValidEnglish || value === "") {
        setNickname(value);
        setIsEnglish(true);
      } else {
        setIsEnglish(false);
      }
    } else if (id === "id") {
      const isValid = validateIDform(value);

      setIsIdRight(isValid);
      if (isValid || value === "") {
        setId(value);
        setIsIdRight(true);
      } else {
        setIsIdRight(false);
      }
    }
  };

  /** modal */

  const OpenModal = () => {
    setIsModalVisible(true);
  };

  const HideModal = () => {
    setIsModalVisible(false);
  };

  /** validaters */

  const validateEnglish = (value: string) => {
    const regex = /^[A-Za-z0-9]+$/;
    if (regex.test(value)) {
      return true;
    }
    return false;
  };

  const validateIDform = (input: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;
    return regex.test(input);
  };

  return (
    <>
      <main className="box">
        <section className="signup-form-container">
          <Form
            className="signup-form"
            action="#"
            method="POST"
            onSubmit={handleSignUp}
          >
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
                  onChange={handleInputChange}
                />
                <p id="id-error" className={!isIdRight ? "show" : "hide"}>
                  영문자와 숫자를 섞어 3자 이상 입력해주세요!
                </p>
              </div>
            </section>

            <section className="signup-title-input-box">
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
            </section>

            <section className="signup-title-input-box">
              <div className="pwd-title-box">
                <label htmlFor="password" className="password-label">
                  비밀번호
                </label>
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

            <section className="two-btn-container-col">
              <div className="signup-button">
                <button
                  type="submit"
                  className="button-type-3"
                  onClick={() => {
                    buttonClickSound(3);
                    handleSignUp;
                  }}
                >
                  회원가입하기
                </button>
                <BasicUILink to={`/`} btnContent="메인으로" />
              </div>
            </section>
          </Form>
        </section>
      </main>
      {/* Compelete / Reject Modal Component */}
      {isModalVisible && (
        <dialog id="x-modal" className="find-pwd-modal">
          <form method="dialog" className="dialog-close-box">
            <button className="dialog-close" onClick={HideModal}>
              ✕
            </button>
          </form>
          <section className="modal-box-welcome">
            {alertMessage ? (
              <section className="modal-box-welcome-box">
                <h3> 확인해주세요! </h3>
                <p>{alertMessage}</p>
                <button
                  onClick={() => {
                    buttonClickSound(3);
                    HideModal();
                    setAlertMessage("");
                  }}
                  className="button-type-3"
                >
                  돌아가기
                </button>
              </section>
            ) : (
              <section className="find-pwd-box">
                <h3>회원 가입 성공!</h3>
                <p>환영합니다, {nickname} 님!</p>
                <Link
                  to={`/`}
                  className="button-type-3"
                  onClick={() => buttonClickSound(3)}
                >
                  메인으로
                </Link>
              </section>
            )}
          </section>
        </dialog>
      )}
    </>
  );
};

export default SignUpForm;
