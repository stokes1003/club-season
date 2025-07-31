import { ScrollView, View, Spinner } from "tamagui";
import { Profile } from "src/components/Profile";
import { useUser } from "src/hooks/useUser";
import { useState } from "react";
import { ChangeEmail } from "src/components/Profile/ChangeEmail";
import { ChangeName } from "src/components/Profile/ChangeName";
import { ChangePassword } from "src/components/Profile/ChangePassword";

export default function ProfileScreen() {
  const user = useUser();
  const [mode, setMode] = useState<"name" | "email" | "password" | "profile">(
    "profile"
  );

  if (!user) {
    return (
      <View flex={1} items="center" bg="$background" px="$8">
        <Spinner size="small" color="$white1" />
      </View>
    );
  }
  return (
    <View flex={1} items="center" bg="$background" py="$10" px="$4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {mode === "profile" && <Profile setMode={setMode} user={user} />}
        {mode === "name" && <ChangeName setMode={setMode} user={user} />}
        {mode === "email" && <ChangeEmail setMode={setMode} user={user} />}
        {mode === "password" && (
          <ChangePassword setMode={setMode} user={user} />
        )}
      </ScrollView>
    </View>
  );
}
