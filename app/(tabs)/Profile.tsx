import { ScrollView, View, Spinner } from "tamagui";
import { useUser } from "src/context/UserContext";
import { ChangeEmail } from "src/components/Profile/ChangeEmail";
import { ChangeName } from "src/components/Profile/ChangeName";
import { ChangePassword } from "src/components/Profile/ChangePassword";
import { Profile } from "src/components/Profile";
import { useNavigation } from "src/context/NavigationContext";

export default function ProfileScreen() {
  const { user } = useUser();
  const { currentProfileState } = useNavigation();

  if (!user) {
    return (
      <View flex={1} items="center" bg="$background" px="$8">
        <Spinner size="small" color="$white1" />
      </View>
    );
  }
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$10" px="$4">
        {currentProfileState === "profile" && <Profile user={user} />}
        {currentProfileState === "changePassword" && (
          <ChangePassword user={user} />
        )}
        {currentProfileState === "changeEmail" && <ChangeEmail user={user} />}
        {currentProfileState === "changeName" && <ChangeName user={user} />}
      </ScrollView>
    </View>
  );
}
