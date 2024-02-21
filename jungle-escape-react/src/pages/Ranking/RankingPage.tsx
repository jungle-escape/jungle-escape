import { api_getRanking } from "@/api/API";

import RingLoader from "@/components/Loading/ringLoader";
import Ranking from "@/components/Ranking/EndRanking";
import { useEffect, useState } from "react";

const RankingPage = () => {
  const [records, setRecords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const rankingData = await api_getRanking();

        //console.log("rankingData", rankingData.data);

        setRecords(rankingData.data);
        setIsLoading(false);
      } catch (error) {
        console.log("[RankingPage] ERROR! : ", error);
        setIsLoading(false);
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
