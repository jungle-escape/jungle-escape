import { useEffect, useState } from "react";
import RingLoader from "@/components/Loading/ringLoader";
import Ranking from "@/components/Ranking/EndRanking";

// import { useNavigate } from "react-router-dom";
// import axios, { AxiosError } from "axios";
// import { api_getRanking } from "@/api/API";

import { RecordData } from "@/lib";
const RankingPage = () => {
  const [records, setRecords] = useState<RecordData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const navigator = useNavigate();

  useEffect(() => {
    // for production
    // const loadRanking = async () => {
    //   try {
    //     const rankingData = await api_getRanking();

    //     //console.log("rankingData", rankingData.data);

    //     setRecords(rankingData.data);
    //     //console.log(rankingData.data);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.log("[RankingPage] ERROR! : ", error);
    //     navigator("/error", { state: { errorMessage: error } });
    //     if (axios.isAxiosError(error)) {
    //       // AxiosError 인 경우
    //       const axiosError = error as AxiosError;
    //       setIsLoading(true);
    //       const errorMessage = axiosError.message || "An error occurred";
    //       navigator("/error", { state: { errorMessage } });
    //     }
    //   }
    // };

    // loadRanking();

    //for dev

    const recordsData = [
      { winner: "Sangwooo", endtime: "1:10:50" },
      { winner: "king", endtime: "1:28:33" },
      { winner: "ZiZonSumin", endtime: "1:30:43" },
      { winner: "BJ", endtime: "2:10:45" },
      { winner: "Junglerrr", endtime: "2:15:30" },
    ];

    setRecords(recordsData);
    //console.log(rankingData.data);
    setIsLoading(false);
    // ]
  }, []);

  return (
    <>
      {isLoading ? (
        <RingLoader />
      ) : (
        records && <Ranking data={{ records: records }} />
      )}
    </>
  );
};

export default RankingPage;
