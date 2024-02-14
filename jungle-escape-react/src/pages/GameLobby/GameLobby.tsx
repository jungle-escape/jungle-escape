import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import ReactDOM from "react-dom";

import "./gameLobby.css";
import BasicBtn from "@/components/Button/BasicButton";

const GameLobby = () => {
  const _levelId = 1940848;
  const [roomName, setRoomName] = useState("");
  const [isSessionStart, setIsSessionStart] = useState(false);

  console.log("==========[Game Lobby] session : ", isSessionStart);

  /** 뒤로가기 관련 logic  */
  // session이 시작했을 때만 blocking
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isSessionStart && currentLocation.pathname !== nextLocation.pathname
  );

  /** 이 컴포넌트가 mount되었을 때 pn.connection 을 시작. 게임 접속은 아니다. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let host: string;
    if (hasEndpoint(window)) {
      host = window._endpoint;
    } else {
      // window._endpoint가 존재하지 않을 때, .env에 세팅해둔 endpoint를 가져온다.
      host = import.meta.env.VITE_ENDPOINT;
    }
    const port = params.get("port") || "8080";

    /** [Connection] : connect via pn */
    pn.connect(host, port, false, null, () => {
      pn.on("join", (room) => {
        room.on("join", (user: any) => {
          LOG.addText(`User ${user.id} joined`);
        });

        room.on("leave", (user: any) => {
          LOG.addText(`User ${user.id} left`);
        });
      });

      pn.on("countdown", (num: any) => {
        ENDLOG.addText(num);
      });

      pn.on("start", (num) => {
        STARTLOG.addText(num);
      });

      pn.on("time", (time: any) => {
        // ELAPSEDTIME.addText(time.toFixed(1));
        ELAPSEDTIME.addText(convertTime(time.toFixed(1)));
      });

      pn.on("winner", (winner: any) => {
        WINNER.addText(`User ${winner} win!\n\nGAME OVER`);
      });

      pn.on("pgbar", (dis: any) => {
        const runner = PROGRESSBAR.entity.findByName(`runner1`);
        runner.setLocalPosition(-175 + dis * (4 / 11), -5, 0);
        BAR.setProgress(dis / 1100);
      });

      pn.on("rank", (list) => {
        let text = "";
        list.forEach((item: any, index: any) => {
          text += "[ " + (index + 1) + " ] " + item[1] + "\n";
        });
        RANK.addText(text);
      });

      pn.on("leave", () => {
        /** 방 떠나기 */
        showRootElement();
        setIsSessionStart(false);
      });
    });

    console.log("[Game Lobby] 컴포넌트가 마운트됐습니다.");

    return () => {
      if (isSessionStart) {
        console.log("세션이 시작된 상태입니다. ", isSessionStart);
        pn.off();
      }

      console.log("[Game Lobby] 첫 번째 작업 클린업");
      console.log("[Game Lobby] 컴포넌트가 언마운트됐습니다.");
    };
  }, []);

  ////////////// button handlers //////////////////
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  ///////////////////////
  //// [ JOIN ROOM ] ////
  ///////////////////////

  const handleJoinRoom = () => {
    console.log(`[Game Lobby/handleJoinRoom] Joining room: ${roomName}`);

    const roomId = parseInt(roomName, 10);
    pn.joinRoom(roomId)
      .then(() => {
        console.log(
          `[Game Lobby/handleJoinRoom] Successfully joined room ${roomId}`
        );
        hideRootElement();
        setIsSessionStart(true);
      })
      .catch((error: Error) => {
        console.error(`Failed to join room ${roomId}:`, error);
      });
  };

  /////////////////////////
  //// [ CREATE ROOM ] ////
  /////////////////////////

  const handleCreateRoom = () => {
    pn.createRoom({ levelId: _levelId, tickrate: 20 }, (_, id) => {
      pn.joinRoom(id)
        .then(() => {
          console.log(
            `[Game Lobby/handleCreateRoom] Successfully joined room ${id}`
          );
          hideRootElement();
          setIsSessionStart(true);
        })
        .catch((error: Error) => {
          console.error(`Failed to join room ${id}:`, error);
        });
    });

    return;
  };

  //////////////////////
  //// [ BLOCKERS ] ////
  //////////////////////

  const handleBlockerProceed = () => {
    console.log("pn leavroom 시작합니다.");
    // pn.leaveRoom();
    pn.leaveRoom()
      .then(() => {
        console.log("Room left successfully");
        console.log("pn leavroom 끝납니다.");
        if (blocker.proceed) {
          blocker.proceed();
        } else {
          console.error("blocker.proceed() error!");
        }
        setIsSessionStart(false);
      })
      .catch((error: Error) => {
        // 오류 처리
        console.error("Failed to leave room:", error);
      });
  };

  const handleBlockerReset = () => {
    if (blocker.reset) {
      blocker.reset();
    } else {
      console.error("blocker.reset() error!");
    }
  };

  ////////////// support functions /////////////////

  // type guard funcs
  //   const hasEndpoint = (obj: any): obj is Window & { _endpoint: string } =>
  //     "_endpoint" in obj;
  const hasEndpoint = (obj: unknown): obj is Window & { _endpoint: string } =>
    typeof obj === "object" && obj !== null && "_endpoint" in obj;

  // handling the root div func
  const hideRootElement = () => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "none";
    } else {
      console.error("Element with id 'root' not found.");
    }
  };

  const showRootElement = () => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "flex";
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

  ////////////// blcok modal /////////////

  const modal = (
    <div className="modal-back-container">
      <div className="modal-backdrop">
        <div className="modal-back">
          <p>정말로 게임을 종료하고 나가시겠습니까?</p>
          <div className="two-btn-container">
            <BasicBtn
              onClickHandler={handleBlockerProceed}
              btnContent={"나가기"}
            />
            <BasicBtn
              onClickHandler={handleBlockerReset}
              btnContent={"돌아가기"}
            />
          </div>
        </div>
      </div>
    </div>
  );

  ///// block modal /////

  const modalRoot = document.getElementById("modal-root");
  const portalContent = modalRoot
    ? ReactDOM.createPortal(modal, modalRoot)
    : null;

  return (
    <>
      {isSessionStart ? null : (
        <div className="box">
          <h1>Game Lobby</h1>
          <ul>
            <li>
              <BasicBtn
                onClickHandler={handleCreateRoom}
                btnContent={"방 만들기"}
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="방 이름을 입력하세요"
                value={roomName}
                onChange={handleInputChange}
              />
            </li>
            <li>
              <BasicBtn
                onClickHandler={handleJoinRoom}
                btnContent={"방 합류하기"}
              />
            </li>
          </ul>
        </div>
      )}
      {blocker.state === "blocked" ? portalContent : null}
    </>
  );
};

export default GameLobby;
