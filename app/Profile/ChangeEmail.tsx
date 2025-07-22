import { ChangeEmail } from "../../src/components/Profile/ChangeEmail";
import { View } from "tamagui";

export default function ChangeEmailScreen() {
  return (
    <View bg="$white1" style={{ flex: 1 }} pt="$8">
      <ChangeEmail />
    </View>
  );
}
