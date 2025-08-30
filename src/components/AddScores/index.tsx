import { YStack } from "tamagui";
import { SelectGolfCourse } from "./SelectGolfCourse";
import { EnterPlayerScores } from "./EnterPlayerScores";
import { useEffect, useState } from "react";
import { ConfirmRoundSubmit } from "./ConfirmRoundSubmit";
import { useRouter } from "expo-router";
import { getAddScoresData } from "../../api/getAddScoresData";
import { SelectLeague } from "./SelectLeague";
import { CourseSelection } from "src/types/courseSelection";
import { useSubmitScores } from "../../hooks/useSubmitScores";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useOfficalRounds } from "../../context/OfficalRoundsContext";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";
import { getLeagueById } from "../../api/getLeagueById";
import { useUser } from "../../context/UserContext";
import { useNavigation } from "../../context/NavigationContext";

type AddScoresData = {
  courses: {
    id: string;
    course_name: string;
  }[];
  players: {
    id: string;
    display_name: string;
    avatar_url: string;
    player_color: string;
  }[];
};

export function AddScores() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const { setSelectedLeague } = useSelectedLeague();
  const { submitRound, isSubmitting } = useSubmitScores();
  const navigation = useNavigation();
  const { addScoresState, setAddScoresState } = navigation;

  const [leagueId, setLeagueId] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [addScoresData, setAddScoresData] = useState<AddScoresData | null>(
    null
  );
  const [isMajor, setIsMajor] = useState("no");
  const [majorName, setMajorName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseSelection | null>(
    null
  );
  const [coursePhotoUrl, setCoursePhotoUrl] = useState<string>(
    selectedCourse?.photo_url ||
      "https://www.golfcoursearchitecture.net/Portals/0/EasyDNNNews/Portals/0/EasyDNNNews/12339/images/generic-golf-image-950-534-p-L-95.webp"
  );
  const { triggerRefresh: triggerLeaderboardRefresh } = useLeaderboard();
  const { triggerRefresh: triggerOfficalRoundsRefresh } = useOfficalRounds();
  const [scoresByPlayer, setScoresByPlayer] = useState<{
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
      player_color: string;
    };
  }>({});

  useEffect(() => {
    if (leagueId) {
      const fetchLeague = async () => {
        const league = await getLeagueById(leagueId);
        setSelectedLeague(league);
      };
      fetchLeague();
    }
  }, [leagueId]);
  const handleHome = () => {
    router.push("/");
    setAddScoresState({ step: "select-league", playerIndex: 0 });
    setIsMajor("no");
    setMajorName("");
    setDate(new Date());
  };

  const handleSubmitRound = () => {
    if (!selectedCourse) return;

    submitRound({
      leagueId,
      selectedCourse,
      isMajor,
      majorName,
      scoresByPlayer,
      coursePhotoUrl,
      date,
      onSuccess: () => {
        handleHome();
        setScoresByPlayer({});
        setSelectedCourse(null);
        triggerLeaderboardRefresh();
        triggerOfficalRoundsRefresh();
        refreshUser();
      },
    });
  };

  useEffect(() => {
    setAddScoresData(null);
    if (leagueId) {
      const fetchAddScoresData = async () => {
        const data = await getAddScoresData(leagueId);
        setAddScoresData(data);
      };
      fetchAddScoresData();
    }
  }, [leagueId]);

  useEffect(() => {
    if (selectedCourse?.photo_url) {
      setCoursePhotoUrl(selectedCourse.photo_url);
    } else {
      setCoursePhotoUrl(
        "https://www.golfcoursearchitecture.net/Portals/0/EasyDNNNews/12339/images/generic-golf-image-950-534-p-L-95.webp"
      );
    }
  }, [selectedCourse]);

  const currentStep = addScoresState?.step || "select-league";
  const currentPlayerIndex = addScoresState?.playerIndex || 0;

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width="100%">
      <YStack gap="$8" width="100%">
        {addScoresState?.step === "select-league" && (
          <SelectLeague setLeagueId={setLeagueId} leagueId={leagueId} />
        )}

        {addScoresState?.step === "select-golf-course" && (
          <SelectGolfCourse
            setSelectedCourse={setSelectedCourse}
            selectedCourse={selectedCourse}
            isMajor={isMajor}
            setIsMajor={setIsMajor}
            majorName={majorName}
            setMajorName={setMajorName}
            leagueId={leagueId}
            date={date}
            setDate={setDate}
          />
        )}
        {addScoresState?.step === "enter-player-scores" && addScoresData && (
          <EnterPlayerScores
            addScoresData={addScoresData}
            setScoresByPlayer={setScoresByPlayer}
            scoresByPlayer={scoresByPlayer}
            isMajor={isMajor}
          />
        )}
        {addScoresState?.step === "confirm-round-submit" && selectedCourse && (
          <ConfirmRoundSubmit
            isSubmitting={isSubmitting}
            handleHome={handleHome}
            scoresByPlayer={scoresByPlayer}
            selectedCourse={selectedCourse}
            isMajor={isMajor}
            majorName={majorName}
            handleSubmitRound={handleSubmitRound}
            date={date}
            coursePhotoUrl={coursePhotoUrl}
            setCoursePhotoUrl={setCoursePhotoUrl}
          />
        )}
      </YStack>
    </YStack>
  );
}
