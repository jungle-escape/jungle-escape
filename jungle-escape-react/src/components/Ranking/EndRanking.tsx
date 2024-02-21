import { useEffect, useState } from "react";
import { RankingData, RecordData } from "@/lib";
import WindowContainer from "@/components/Window/Window_container";
import "./ranking.css";
import { Link, useNavigate } from "react-router-dom";
import CrownIcon from "@/assets/crown-icon.svg?react";
//const Ranking = ({ rankingList, endtime, topRender }: WinnerData) => {
const Ranking = ({ data }: { data: RankingData }) => {
  // winnerData = {winner(배열), endtime(stirng)}

  // winner: 현재의 rankinglist  [ [ 11.767155780757323, '[Guest] 716', '195-485' ] ]

  const [winner, setWinner] = useState("");
  const [record, setRecord] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [currUser, setCurrUser] = useState("");

  const [rankingRecords, setRankingRecords] = useState<RecordData[]>([]);

  const history = useNavigate();

  useEffect(() => {
    if ("result" in data) {
      const nowUser = window.localStorage.getItem("nickname") || "";

      const winner = data.result?.rankingList[0][1] || "";
      const userlist = data.result?.rankingList.map((item) => item[1]) || [];
      const endtime = data.result?.endtime || "";

      setCurrUser(nowUser);

      setWinner(winner);
      setParticipants(userlist);
      setRecord(endtime);

      //console.log("[Result] nowUser : ", nowUser, "/winner : ", winner);
    } else if ("records" in data) {
      const recordsData = data.records.slice(0, 5);
      setRankingRecords(recordsData);
    }
  }, []);

  return (
    <>
      {"result" in data ? (
        <div style={{ backgroundColor: "black", zIndex: "3" }}>
          <WindowContainer className="window-result">
            <main className="box">
              <section className="winner">
                <div className="winner-box ">
                  <CrownIcon className="crown" width={"60%"} height={"60%"} />
                  <h1>WINNER</h1>
                </div>
                <span className="iamWinner">{winner}</span>
                <h2 id="winner-time">{record}</h2>
              </section>
              <section className="member">
                <ul className="record-list">
                  {participants.map((member, idx) => (
                    <li key={idx} className="record-li-result">
                      <span className={member === currUser ? "iam" : ""}>
                        {idx + 1}
                      </span>
                      <span className={member === currUser ? "iam" : ""}>
                        {member}
                      </span>
                      <span className={member === currUser ? "iam" : "itsme"}>
                        [ME]
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              <div className="two-btn-container" style={{ marginTop: "30px" }}>
                <Link className="button-type-3" to={`/`}>
                  메인으로
                </Link>
                <button onClick={() => history(-1)} className="button-type-3">
                  뒤로가기
                </button>
              </div>
            </main>
          </WindowContainer>
        </div>
      ) : (
        <main className="box">
          <section className="record-container">
            <h1 id="ranking-title">RANKING</h1>
            <div className="record-box">
              <ul className="record-list">
                {rankingRecords.map((record, idx) => {
                  const colorClass =
                    idx + 1 === 1
                      ? "gold"
                      : idx + 1 === 2
                      ? "silver"
                      : idx + 1 === 3
                      ? "bronze"
                      : "";

                  return (
                    <li key={idx} className="record-li">
                      <span className={colorClass}>{idx + 1}</span>
                      <span className={colorClass}>{record.winner}</span>
                      <span className={colorClass}>{record.endtime}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
          <div className="two-btn-container" style={{ marginTop: "20px" }}>
            <Link className="button-type-3" to={`/`}>
              메인으로
            </Link>
            <button onClick={() => history(-1)} className="button-type-3">
              뒤로가기
            </button>
          </div>
        </main>
      )}
    </>
  );
};

export default Ranking;
