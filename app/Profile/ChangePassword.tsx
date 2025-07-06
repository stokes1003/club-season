import { ChangePassword } from "../../src/components/Profile/ChangePassword";
import { View } from "tamagui";

export default function ChangePasswordScreen() {
  return (
    <View bg="$white1" style={{ flex: 1 }}>
      <ChangePassword />
    </View>
  );
}
