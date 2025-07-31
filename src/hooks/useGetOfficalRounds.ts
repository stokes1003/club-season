import { useEffect, useState } from "react";
import { getLeagueRounds } from "../api/leagueRounds";

type TransformedRound = {
  _id: string;
  course: string;
  course_img: string;
  isMajor: boolean;
  majorName: string;
  date: string;
  scores: {
    player: string;
    player_img: string;
    player_color: string;
    gross: number;
    hcp: number;
    net: number;
  }[];
};

export function useGetOfficalRounds(leagueId: string, refreshTrigger?: number) {
  const [rounds, setRounds] = useState<TransformedRound[]>([]);

  useEffect(() => {
    const fetchRounds = async () => {
      const data = await getLeagueRounds(leagueId);
      setRounds(data || []);
    };
    fetchRounds();
  }, [leagueId, refreshTrigger]);

  return rounds;
}
