import AppText from "@/shared/components/AppText";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const theme = useTheme();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameError("");
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError("");
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
    } catch (error: any) {
      const payload = error?.payload;

      if (Array.isArray(payload)) {
        setUsernameError(
          payload.find((e: { description: string }) =>
            e.description.toLowerCase().includes("username"),
          )?.description || "",
        );
        setPasswordError(
          payload.find((e: { description: string }) =>
            e.description.toLowerCase().includes("password"),
          )?.description || "",
        );
      } else {
        setUsernameError(payload?.UserName || "");
        setPasswordError(payload?.Password || "");
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.surface }]}
    >
      <Image
        style={styles.logo}
        source={require("@/assets/images/react-logo.png")}
      />
      <AppText type="headline-medium" style={styles.textCenter}>
        Sign up to Calibr8Fit
      </AppText>
      <View style={styles.form}>
        <TextField
          label="Username"
          onChangeText={handleUsernameChange}
          value={username}
          error={usernameError !== ""}
          supportingText={usernameError}
        />
        <TextField
          label="Password"
          onChangeText={handlePasswordChange}
          value={password}
          error={passwordError !== ""}
          supportingText={passwordError}
        />
      </View>
      <TextButton
        onPress={handleRegister}
        label="Continue"
        labelType="title-medium"
        style={styles.continueButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    padding: 32,
    justifyContent: "flex-end",
  },
  logo: {
    height: 288,
    alignSelf: "stretch",
    backgroundColor: "red",
  },
  textCenter: {
    textAlign: "center",
  },
  form: {
    gap: 6,
    height: 256,
  },
  continueButton: {
    alignSelf: "stretch",
    marginHorizontal: 32,
  },
});
