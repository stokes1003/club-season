import { YStack, XStack, Button, View, Text, Spinner } from "tamagui";
import { Alert, Modal } from "react-native";
import type { League } from "..";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { LeaguePlayerDetails } from "./LeaguePlayerDetails";
import { useUser } from "src/context/UserContext";
import { LeagueDetails } from "./LeagueDetails";
import { LeagueCourseDetails } from "./LeagueCourseDetails";
import { Player } from "src/types/player";
import { useState } from "react";
import {
  deleteLeague,
  deleteLeagueScores,
  deleteLeagueRounds,
  deleteLeaguePlayers,
  deleteLeagueCourses,
} from "src/api/deleteLeague";

export function LeagueProfile({
  selectedLeague,
  setSelectedLeague,
  setSelectedPlayer,
  setSelectedCourse,
}: {
  selectedLeague: League;
  setSelectedLeague: (league: League | null) => void;
  setSelectedPlayer: (player: Player | null) => void;
  setSelectedCourse: (course: any) => void;
}) {
  const { user } = useUser();
  const isCommissioner = user?.id === selectedLeague?.created_by;
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Early return if selectedLeague is not available
  if (!selectedLeague) {
    return null;
  }

  const handleDeleteLeague = async () => {
    setIsDeleting(true);
    try {
      await deleteLeagueScores(selectedLeague.id);
      await deleteLeagueRounds(selectedLeague.id);
      await deleteLeaguePlayers(selectedLeague.id);
      await deleteLeagueCourses(selectedLeague.id);
      await deleteLeague(selectedLeague.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete league");
      setIsDeleting(false);
      return;
    } finally {
      setSelectedLeague(null);
      setConfirmationModal(false);
      setIsDeleting(false);
    }
  };

  return (
    <YStack gap="$6" style={{ alignItems: "center", width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable
          onPress={() => {
            setSelectedLeague(null);
          }}
        >
          <ArrowLeft />
        </Pressable>
      </XStack>
      <LeagueDetails selectedLeague={selectedLeague} />
      <YStack gap="$8">
        <LeaguePlayerDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
          setSelectedPlayer={setSelectedPlayer}
        />
        <LeagueCourseDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
          setSelectedCourse={setSelectedCourse}
        />
      </YStack>
      {isCommissioner && (
        <Button
          bg="$red10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width={320}
          onPress={() => setConfirmationModal(true)}
        >
          Delete League
        </Button>
      )}
      <Modal
        visible={confirmationModal}
        onRequestClose={() => setConfirmationModal(false)}
        transparent={true}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <YStack
            gap="$6"
            borderWidth={2}
            width={340}
            p="$4"
            borderColor="$red10"
            bg="$white1"
            style={{
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "flex-end", width: "100%" }}>
              <Pressable onPress={() => setConfirmationModal(false)}>
                <X />
              </Pressable>
            </View>

            <YStack gap="$2" style={{ alignItems: "center" }}>
              <Text fontSize="$6" fontWeight="bold" color="$red10">
                Delete League
              </Text>
              <Text
                fontSize="$5"
                fontWeight="400"
                style={{ textAlign: "center" }}
              >
                Are you sure you want to delete this league? This action cannot
                be undone.
              </Text>
            </YStack>

            <XStack
              gap="$4"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Button
                bg="$white1"
                borderColor="$blue10"
                borderWidth={1}
                color="$blue10"
                fontSize="$5"
                fontWeight="bold"
                width={140}
                onPress={() => setConfirmationModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="$white1"
                fontSize="$5"
                fontWeight="bold"
                width={140}
                bg="$red10"
                onPress={() => {
                  handleDeleteLeague();
                }}
              >
                {isDeleting ? <Spinner color="$white1" /> : "Delete"}
              </Button>
            </XStack>
          </YStack>
        </View>
      </Modal>
    </YStack>
  );
}
