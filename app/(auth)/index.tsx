import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const theme = useTheme();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameError("");
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError("");
  };

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error: any) {
      const payload = error?.payload;

      setUsernameError(payload.UserName || "");
      setPasswordError(payload.Password || "");
      setErrorMessage(payload[0] || "");
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
        Sign in to Calibr8Fit
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
        <Divider />
        <AppText
          type="title-small"
          color="onSurfaceVariant"
          style={styles.signUpHint}
        >
          Don’t have an account?
        </AppText>
        <TextButton
          onPress={() => router.push("/sign-up")}
          variant="text"
          label="Sign up"
          labelType="label-large"
        />
        <AppText
          type="label-large"
          style={[styles.errorText, { color: theme.error }]}
        >
          {errorMessage}
        </AppText>
      </View>
      <TextButton
        onPress={handleLogin}
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
    padding: 32,
    gap: 32,
    justifyContent: "flex-end",
    alignContent: "center",
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
  signUpHint: {
    textAlign: "center",
    fontWeight: "500",
  },
  errorText: {
    flex: 1,
    verticalAlign: "bottom",
    textAlign: "center",
  },
  continueButton: {
    alignSelf: "stretch",
    marginHorizontal: 32,
  },
});
