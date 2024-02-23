import { useEffect, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";
import { loginState } from "@/recoil/loginState";

//components
import BasicBtn from "@/components/Button/BasicButton";
import GameCloseModal from "@/components/CustomAlert/GameCloseModal";
import CustomAlert from "@/components/CustomAlert/CustomAlertModal";
import Loader3d from "@/components/Loading/Loading3d";
import BasicUILink from "@/components/Button/BasicUILink";
import RingLoader from "@/components/Loading/ringLoader";

//css
import "./gameLobby.css";
import "@/components/CustomAlert/modal.css";

//type, reocil, API
import { UserData, WinnerDataFromServer } from "@/lib";
import { buttonClickSound } from "@/components/BGM/buttonPlaySound";

import { musicState } from "@/recoil/musicState";
import { gameState } from "@/recoil/gameState";

//import { api_recordRanking, api_getCurrentUser } from "@/api/API";

const GameLobby = () => {
  const _levelId = 1940848;
  //game logic
  const [roomName, setRoomName] = useState("");
  const [isSessionStart, setIsSessionStart] = useState(false);
  const [isUpdateRanking, setIsUpdateRanking] = useState(false);
  //ui logic
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showLogOutModal, setshowLogOutModal] = useState(false);
  //login logic
  const [loginData, setLoginData] = useRecoilState(loginState);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isNumber, setIsNumber] = useState(true);
  //logout logic
  const [isReload, setIsReload] = useState(false);
  //music logic
  const [musicData, setMusicData] = useRecoilState(musicState);
  const [gameData, setGameData] = useRecoilState(gameState);

  const navigate = useNavigate();

  /** check important requirements for this page */
  useEffect(() => {
    if (typeof pn === "undefined") {
      window.location.reload();
    }
    //pn.js가 로드되지 않았을 때, 자동 새로고침
    if (!pn) {
      window.location.reload();
    }
    //로그인 하지 않았을 시, 메인으로
    if (!loginData.isLoggedIn) {
      if (isReload) {
        // IF log out
        setShowLoader(true);
        window.location.reload();
      } else {
        // other reason
        navigate("/");
      }
    }
    //pn이 존재하고, 로그인 상태일 시 데이터를 가져옴
    else {
      handleUserInfo();
    }
  }, [loginData, navigate]);

  /** 이 컴포넌트가 mount되었을 때 pn.connection 을 시작. 게임 접속은 아니다. */
  useEffect(() => {
    if (loginData.isLoggedIn && userInfo) {
      //로그인 상태 & userInfo가 load되었을 때에만 pn.connection 시작

      let host: string;
      if (hasEndpoint(window)) {
        host = window._endpoint;
      } else {
        // window._endpoint가 존재하지 않을 때, .env에 세팅해둔 endpoint를 가져온다.
        host = import.meta.env.VITE_ENDPOINT;
      }
      const placeholder = host === "localhost" ? "DEV" : "PROD";
      const port = placeholder === "DEV" ? "8080" : "";
      const isSecure = placeholder === "DEV" ? false : true;

      /** [Connection] : connect via pn */
      console.info(
        `[GAME LOBBY] Connecting to [[[ ${placeholder} ]]] server...`
      );

      // 마지막으로 받은 시간을 저장하기 위한 변수
      let lastReceivedTime: string | null = null;

      /** check websocket before connection */
      if (!pn.isSocketOpened) {
        // pn.connect(host, port, false, null, () => {
        pn.connect(host, port, isSecure, userInfo, () => {
          console.log("[INFO] | ", `${userInfo.nickname} is connectiong...`);
          pn.on("join", (room) => {
            room.on("join", (user: any) => {
              LOG.addText(`${convertUsername(user)} joined`);
            });

            room.on("leave", (user: any) => {
              LOG.addText(`${convertUsername(user)} left`);
            });
          });

          pn.on("countdown", (num: any) => {
            ENDLOG.addText(num);
          });

          pn.on("start", (num) => {
            STARTLOG.addText(num);
          });

          pn.on("falling", () => {
            HELLOWORLD.boom();
          });

          pn.on("time", (time: number) => {
            // ELAPSEDTIME.addText(time.toFixed(1));
            ELAPSEDTIME.addText(convertTime(time.toFixed(1)));
            lastReceivedTime = convertTime(time.toFixed(1));
          });

          pn.on("winner", (winner: any) => {
            setIsUpdateRanking(true);

            //기존 winner = user.id를 전달
            if (typeof winner === "number") {
              WINNER.addText(`Guest ${winner} win!\n\nGAME OVER`);
            }

            //신규 로직 rankingList를 winner라는 이름으로 전달
            // rankingList [ [ 11.767155780757323, '[Guest] 716', '195-485' ] ]
            else {
              let endtime = lastReceivedTime;
              WINNER.addText(`${winner[0][1]} win!\n\nGAME OVER`);

              if (winner[0][1] === userInfo.nickname) {
                //자신이 winner일 때
                if (endtime === null) {
                  //handleRanking([winner], "-");
                  endtime = "-";
                }
                if (endtime) {
                  //handleRanking(winner, endtime); //API 통신
                  console.log(`${winner[0][1]} : ${endtime} recorded`);
                  lastReceivedTime = null;
                }
                moveUserToResultPage(true, { winner, endtime });
              } else {
                //자신이 winner가 아닐 때
                if (endtime === null) endtime = "-";
                moveUserToResultPage(false, { winner, endtime });
              }

              lastReceivedTime = null;
            }
          });

          pn.on("pgbar", (dis: number) => {
            const runner = PROGRESSBAR.entity.findByName(`runner1`);
            runner.setLocalPosition(-200 + (1400 - dis) * (5 / 11), -5, 0);
            BAR.setProgress((1400 - dis) / 1100);
          });

          pn.on("rank", (list) => {
            let text = "";
            list.forEach((item: any, index: number) => {
              text += "[" + (index + 1) + "] " + item[1] + "\n";
            });
            RANK.addText(text);
          });

          pn.on("leave", () => {
            /** 방 떠나기 */

            console.log("leave Room [1] |  isSessionStart | ", isSessionStart);

            if (isUpdateRanking) {
              setTimeout(() => {
                console.log(" Update Ranking ...");
                setIsSessionStart(false);
                showRootElement();
                setGameData({ ...gameData, isGameStart: false });
              }, 1000);
            } else {
              console.log("Leaving the room . . . ");
              setIsSessionStart(false);
              showRootElement();
              setGameData({ ...gameData, isGameStart: false });
            }

            console.log("leave Room [2] |  isSessionStart | ", isSessionStart);
          });
        });
      } else {
        // 이미 연결이 열린 상태일 경우
        //console.log("WebSocket is already connected");
      }
    }

    //console.log("[Game Lobby] 컴포넌트가 마운트됐습니다.");

    return () => {
      if (isSessionStart) {
        console.log("세션이 시작된 상태입니다. ", isSessionStart);
        pn.off();
      }

      //console.log("[Game Lobby] 첫 번째 작업 클린업");
      console.log("[Game Lobby] ummounted.");
    };
  }, [userInfo]);

  /** 뒤로가기 관련 logic  */
  // session이 시작하고 끝나지 않았을(=winner 이벤트 발생하지 않았을) 때만 blocking
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (nextLocation.pathname === "/result") return false;
    if (!gameData.isGameStart) return false;
    return (
      isSessionStart && //세션(게임 방 입장)이 시작했으며
      currentLocation.pathname !== nextLocation.pathname //이동이 감지된다면 blocking
    );
  });

  ///////////// handler functions /////////////////

  ////////////////////////
  // user info and login//
  ////////////////////////

  const handleUserInfo = async () => {
    try {
      ///// for PRODUCTION //////
      //id, nickname, participantedRooms 정보를 얻을 수 있음.
      // const res = await api_getCurrentUser();
      // if (!res || !res.data) {
      //   console.log("데이터가 존재하지 않습니다.");
      //   return;
      // }
      // const { id, nickname, participatedRooms } = res.data as UserData;
      // setUserInfo({ id, nickname, participatedRooms });
      // const res = await api_getCurrentUser();
      // if (!res || !res.data) {
      //   console.log("데이터가 존재하지 않습니다.");
      //   return;
      // }
      // const { id, nickname, participatedRooms } = res.data as UserData;
      // setUserInfo({ id, nickname, participatedRooms });

      //// for DEV ////
      const myNickName = window.localStorage.getItem("nickname");
      const myUserInfo = {
        id: "id",
        nickname: myNickName,
        participatedRooms: [],
      };
      setUserInfo(myUserInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogOut = () => {
    buttonClickSound(1);
    setIsReload(true);

    setLoginData({ ...loginData, isLoggedIn: false, token: "" });
    //localStorage.removeItem("currentUserId"); //prd
    localStorage.removeItem("nickname"); //dev
  };

  ////////////// button handlers //////////////////

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isValidEnglish = validateNumber(value);

    setIsNumber(isValidEnglish);
    if (isValidEnglish || value === "") {
      setRoomName(value);
      setIsNumber(true);
    } else if (!isValidEnglish) {
      // 경고 메시지 표시 여부 결정
      setIsNumber(false);
    }
  };

  const handleCloseModals = () => {
    buttonClickSound(1);
    setShowAlert(false);
    setShowLoader(false);
  };

  ///////////////////////
  //// [ JOIN ROOM ] ////
  ///////////////////////

  const handleJoinRoom = () => {
    buttonClickSound(1);
    if (roomName === "") {
      setAlertMessage("방 번호가 입력되지 않았습니다!");
      setShowAlert(true);
      buttonClickSound("alert_open");
      return;
    }

    setShowLoader(true);

    const roomId = parseInt(roomName, 10);
    pn.joinRoom(roomId)
      .then(() => {
        hideRootElement();
        setIsSessionStart(true);

        setShowLoader(false);
      })
      .catch((error: Error) => {
        if (error.message === "full") {
          setShowLoader(false);
          setAlertMessage("방이 가득 찼습니다. 다른 방으로 참가해주세요.");
          setShowAlert(true);
          buttonClickSound("alert_open");
        } else {
          console.error(`Failed to join room ${roomId}:`, error);
          setAlertMessage(`입장에 실패하였습니다 :${error}`);
          setShowAlert(true);
          buttonClickSound("alert_open");
        }
      });
  };

  /////////////////////////
  //// [ CREATE ROOM ] ////
  /////////////////////////

  const handleCreateRoom = () => {
    buttonClickSound("make_room");
    setShowLoader(true);

    pn.createRoom({ levelId: _levelId, tickrate: 20 }, (_, id) => {
      pn.joinRoom(id)
        .then(() => {
          console.log(
            `[Game Lobby/handleCreateRoom] Successfully joined room ${id}`
          );

          hideRootElement();
          setIsSessionStart(true);

          setShowLoader(false);
          setGameData({ ...gameData, isGameStart: true });
        })
        .catch((error: Error) => {
          console.error(`Failed to join room ${id}:`, error);
          setAlertMessage(`방 생성에 실패하였습니다. \n:${error}`);
          setShowAlert(true);
          buttonClickSound("alert_open");
        });
    });

    return;
  };

  //////////////////////
  //// [ BLOCKERS ] ////
  //////////////////////

  const handleBlockerProceed = () => {
    buttonClickSound(1);
    /** game 방 떠나기 */
    pn.leaveRoom()
      .then(() => {
        console.log("Room left successfully");
        if (blocker.proceed) {
          setShowLoader(true);
          setGameData({ ...gameData, isGameStart: false });
          //blocker.proceed(); //go out lobby page, bad for ux
          blocker.reset();
          showRootElement();
        } else {
          console.error("blocker.proceed() error!");
        }

        setIsSessionStart(false);
        setShowLoader(false);
      })
      .catch((error: Error) => {
        console.error("Failed to leave room:", error);
      });
  };

  const handleBlockerReset = () => {
    buttonClickSound(1);
    if (blocker.reset) {
      blocker.reset();
    } else {
      console.error("blocker.reset() error!");
    }
  };

  const moveUserToResultPage = (
    isWinner: boolean,
    winnerData: WinnerDataFromServer
  ) => {
    setGameData({ ...gameData, isGameStart: false });
    let readyTime = 2500;
    const { winner, endtime } = winnerData;

    if (isWinner) readyTime = 2100;
    //게임에서 끝나고 카운트다운을 하는 동안 화면에서 대기
    setTimeout(function () {
      // if (isWinner)
      //   console.log("[moving] 승자 게임 끝, 결과 화면으로 이동합니다.");
      // else console.log("[moving] 참가자 게임 끝, 결과 화면으로 이동합니다.");

      navigate("/result", {
        state: { rankingList: winner, endtime: endtime },
      });

      setIsUpdateRanking(false);
    }, readyTime);
  };

  ////////////// support functions /////////////////

  // type guard funcs
  const hasEndpoint = (obj: unknown): obj is Window & { _endpoint: string } =>
    typeof obj === "object" && obj !== null && "_endpoint" in obj;

  // handling the root div func
  const hideRootElement = () => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "none";
      setMusicData({ ...musicData, isPlay: false }); //music off
    } else {
      console.error("Element with id 'root' not found.");
    }
  };
  // handling the root div func
  const showRootElement = () => {
    console.log("[gameLobby] show room complete");
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "flex";
      setMusicData({ ...musicData, isPlay: true }); //music on
    } else {
      console.error("Element with id 'root' not found.");
    }
  };

  // ingame time counter
  const convertTime = function (timeString: string) {
    const time = parseFloat(timeString);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.round((time % 1) * 10);

    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMilliseconds =
      milliseconds < 10 ? milliseconds + "0" : milliseconds.toString();

    const formattedTime =
      minutes + ":" + formattedSeconds + ":" + formattedMilliseconds;

    return formattedTime;
  };

  // for addTexts
  const convertUsername = (user: any) => {
    let showname;
    //if nickname is not exist, guest naming
    if (!user.nickname) {
      showname = "Guest " + user.id;
    }
    //if nickname exist, use the nickname
    else if (user.nickname) {
      showname = user.nickname;
    }
    // if any other troubles, show user.id(number)
    else {
      console.log("[convertUsername] user.nickname issue occured!");
      showname = `User ${user.id}`;
    }

    return `${showname}`;
  };

  const validateNumber = (value: string) => {
    const regex = /^-?\d+(\.\d+)?$/;
    if (regex.test(value)) {
      return true;
    }
    return false;
  };

  // const handleRanking = async (
  //   rankingList: Array<string>,
  //   lastReceivedTime: string
  // ) => {
  //   const winner = rankingList[0][1];
  //   [0][1];
  //   const endtime = lastReceivedTime;
  //   const participants = rankingList.map((item) => item[1]);

  //   `winner ${rankingList[0][1]} : ${lastReceivedTime}`
  //   await api_recordRanking({ winner, endtime, participants }); //for dev
  //   return;
  // };

  //////////////////////////
  ///// Modal & Loader /////
  //////////////////////////

  /** Components which are attached to outside div, not id = 'root',
   * for covering entire screen. */

  // GET outside div //
  const modalRoot = document.getElementById("modal-root");

  // for Going Back
  const portalContent = modalRoot
    ? ReactDOM.createPortal(
        <GameCloseModal
          modalContent="정말로 게임을 종료하고 나가시겠습니까?"
          handleBlockerProceed={handleBlockerProceed}
          handleBlockerReset={handleBlockerReset}
          processMsg={"게임 종료하기"}
          resetMsg={"게임 돌아가기"}
        />,
        modalRoot
      )
    : null;

  // for custumized alert modal
  const customAlertModal =
    showAlert && modalRoot
      ? ReactDOM.createPortal(
          <CustomAlert
            modalContent={alertMessage}
            onClickHandler={handleCloseModals}
          />,
          modalRoot
        )
      : null;

  // for 3d modal
  const loader3d =
    showLoader && modalRoot
      ? ReactDOM.createPortal(<Loader3d />, modalRoot)
      : null;

  // for logOut button
  const logOutModal =
    showLogOutModal && modalRoot
      ? ReactDOM.createPortal(
          <GameCloseModal
            modalContent="로그아웃 하시겠습니까?"
            handleBlockerProceed={handleLogOut}
            handleBlockerReset={() => {
              //로그아웃 취소시 행동
              buttonClickSound(1);
              setshowLogOutModal(false);
            }}
            processMsg={"로그아웃"}
            resetMsg={"돌아가기"}
          />,
          modalRoot
        )
      : null;

  ////// Rendering //////

  return (
    <>
      {/* {isSessionStart ? null : (
        
      )} */}

      <div className="box">
        {userInfo ? (
          <>
            <p className="newfont-white">
              오늘도 달려볼까요,
              <br />
              <span className="oldfont-lightgreen">
                {" "}
                {userInfo.nickname}
              </span>{" "}
              님
            </p>

            <ul className="lobby-ul">
              <li>
                <BasicBtn
                  onClickHandler={handleCreateRoom}
                  btnContent={"방 만들기"}
                />
              </li>
              <li>
                <input
                  className="roomInputBox"
                  type="text"
                  placeholder="합류할 방 번호를 입력하세요"
                  value={roomName}
                  onChange={handleInputChange}
                />
                <BasicBtn
                  onClickHandler={handleJoinRoom}
                  btnContent={"방 합류하기"}
                />
                <p
                  id="roomnumber-error"
                  className={!isNumber ? "show" : "hide"}
                >
                  숫자만 입력해주세요!
                </p>
              </li>
              {/* <li>
  <BasicBtn
    onClickHandler={handleShowRanking}
    btnContent={"랭킹 가져오기"}
  />
</li> */}
              <li>
                <button
                  onClick={() => {
                    buttonClickSound(3);
                    setshowLogOutModal(true);
                  }}
                  className="button-type-3"
                  style={{ width: "50%", height: "70%" }}
                >
                  로그아웃
                </button>
              </li>
              <li>
                <BasicUILink
                  to={`/ranking`}
                  style={{ width: "50%", height: "70%" }}
                  btnContent="랭킹보기"
                />
              </li>
            </ul>
          </>
        ) : (
          <RingLoader />
        )}
      </div>
      {blocker.state === "blocked" ? portalContent : null}
      {customAlertModal}
      {loader3d}
      {logOutModal}
    </>
  );
};

export default GameLobby;
