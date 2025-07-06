import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Input, Label, Text, View, YStack } from "tamagui";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Signup Error", error.message);
    } else if (user && !session) {
      Alert.alert(
        "Check your email",
        "We've sent you a verification email. Please check your inbox and spam folder."
      );
    } else if (session) {
      Alert.alert("Success", "You're signed up and logged in!");
    }
    setLoading(false);
  }

  return (
    <YStack gap="$8" mt="$20" style={{ alignItems: "center" }} bg="$background">
      <YStack gap="$4" style={{ alignItems: "center" }} width="$20">
        <Text fontSize="$8" fontWeight="bold">
          Welcome to Club Season
        </Text>
        <Text fontSize="$4" color="$black10" style={{ textAlign: "center" }}>
          Track rounds, manage your league, and compete all season long.
        </Text>
      </YStack>
      <YStack gap="$2" style={{ alignItems: "center" }}>
        <View>
          <Label fontSize="$5">Email</Label>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            width="$20"
          />
        </View>
        <View>
          <Label fontSize="$5">Password</Label>
          <Input
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            width="$20"
          />
        </View>
      </YStack>
      <YStack gap="$4">
        <View>
          <Button
            disabled={loading}
            onPress={() => signInWithEmail()}
            bg="$blue10"
            color="$white1"
            fontSize="$5"
            fontWeight="bold"
            width="$20"
          >
            Sign in
          </Button>
        </View>
        <View>
          <Button
            disabled={loading}
            onPress={() => signUpWithEmail()}
            fontSize="$5"
            variant="outlined"
            borderColor="$blue10"
            color="$blue10"
            fontWeight="bold"
            width="$20"
          >
            Sign up
          </Button>
        </View>
      </YStack>
    </YStack>
  );
}
