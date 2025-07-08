import { View } from "tamagui";
import { ChangeName } from "../../../src/components/Profile/ChangeName";

export default function ChangeNameScreen() {
  return (
    <View bg="$white1" style={{ flex: 1 }}>
      <ChangeName />
    </View>
  );
}
