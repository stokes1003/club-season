import { TopThree } from "./TopThree";
import { LeagueTable } from "./LeagueTable";
import { OfficialRounds } from "./OfficialRounds/index";
import { League } from "src/context/SelectedLeagueContext";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { useState } from "react";

export function LeagueHome({ selectedLeague }: { selectedLeague: League }) {
  const players = useGetPlayers(selectedLeague?.id || "");
  const [isNet, setIsNet] = useState(true);
  return (
    <>
      <TopThree league={selectedLeague} isNet={isNet} setIsNet={setIsNet} />
      <LeagueTable isNet={isNet} players={players} />
      <OfficialRounds league={selectedLeague} />
    </>
  );
}
