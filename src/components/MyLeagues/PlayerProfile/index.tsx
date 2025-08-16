import { Player } from "src/types/player";
import { League } from "..";
import { PlayerDetails } from "./PlayerDetails";
import { ChangeDisplayName } from "./ChangeDisplayName";
import { ChangeInviteEmail } from "./ChangeInviteEmail";
import { ChangePlayerRole } from "./ChangePlayerRole";
import { useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";

type PlayerProfileMode =
  | "profile"
  | "change-name"
  | "change-email"
  | "change-role";

export function PlayerProfile({
  selectedPlayer,
  setSelectedPlayer,
  selectedLeague,
}: {
  selectedPlayer: Player;
  setSelectedPlayer: (player: Player | null) => void;
  selectedLeague: League;
}) {
  const [mode, setMode] = useState<PlayerProfileMode>("profile");
  const { canGoBack, navigateBack } = useNavigation();

  const renderCurrentMode = () => {
    switch (mode) {
      case "change-name":
        return (
          <ChangeDisplayName
            selectedPlayer={selectedPlayer}
            selectedLeague={selectedLeague}
            setMode={setMode}
            setSelectedPlayer={setSelectedPlayer}
          />
        );

      case "change-email":
        return (
          <ChangeInviteEmail
            selectedPlayer={selectedPlayer}
            selectedLeague={selectedLeague}
            setMode={setMode}
            setSelectedPlayer={setSelectedPlayer}
          />
        );

      case "change-role":
        return (
          <ChangePlayerRole
            selectedPlayer={selectedPlayer}
            selectedLeague={selectedLeague}
            setMode={setMode}
            setSelectedPlayer={setSelectedPlayer}
          />
        );

      default:
        return (
          <PlayerDetails
            setMode={setMode}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            selectedLeague={selectedLeague}
          />
        );
    }
  };

  return <>{renderCurrentMode()}</>;
}
