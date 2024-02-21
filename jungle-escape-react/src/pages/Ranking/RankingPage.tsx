import { api_getRanking } from "@/api/API";

import RingLoader from "@/components/Loading/ringLoader";
import Ranking from "@/components/Ranking/EndRanking";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RankingPage = () => {
  const [records, setRecords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const rankingData = await api_getRanking();

        //console.log("rankingData", rankingData.data);

        setRecords(rankingData.data);
        setIsLoading(false);
      } catch (error) {
        console.log("[RankingPage] ERROR! : ", error);
        navigator("/error", { state: { errorMessage: error } });
        if (axios.isAxiosError(error)) {
          // AxiosError 인 경우
          const axiosError = error as AxiosError;
          setIsLoading(true);
          const errorMessage = axiosError.message || "An error occurred";
          navigator("/error", { state: { errorMessage } });
        }
      }
    };

    loadRanking();
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
