import { YStack, Text } from "tamagui";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Pressable } from "react-native";

export function SelectDate({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <YStack gap="$2" style={{ alignItems: "center" }}>
      <Text fontSize="$7" fontWeight="bold">
        Date of Round:
      </Text>

      <Pressable onPress={() => setIsVisible(true)}>
        <YStack gap="$1" style={{ alignItems: "center" }}>
          <Text fontSize="$6" fontWeight="400" color="$black10">
            {date.toLocaleDateString()}
          </Text>

          <Text fontSize="$2" color="$blue10">
            Change Date
          </Text>
        </YStack>
      </Pressable>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        date={date}
        display="inline"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setIsVisible(false);
        }}
        onCancel={() => setIsVisible(false)}
        maximumDate={new Date()}
      />
    </YStack>
  );
}
