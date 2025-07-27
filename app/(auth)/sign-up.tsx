import AppText from "@/shared/components/AppText";
import Button from "@/shared/components/Button";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from 'expo-image';
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const theme = useTheme();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameError('');
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError('');
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
    } catch (error: any) {
      const cause = error?.cause;

      if (Array.isArray(cause)) {
        setUsernameError(cause.find((e: { description: string }) =>
          e.description.toLowerCase().includes('username'))?.description || '');
        setPasswordError(cause.find((e: { description: string }) =>
          e.description.toLowerCase().includes('password'))?.description || '');
      } else {
        setUsernameError(cause?.UserName || '');
        setPasswordError(cause?.Password || '');
      }
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      gap: 32,
      padding: 32,
      justifyContent: 'flex-end',
      backgroundColor: theme.background
    }}>
      <Image style={{ height: 288, alignSelf: 'stretch', backgroundColor: 'red' }}
        source={require('@/assets/images/react-logo.png')}
      />
      <AppText type='headline-medum' style={{ textAlign: 'center' }}>Sign up to Calibr8Fit</AppText>
      <View style={{ gap: 6, height: 256 }}>
        <TextField
          label='Username'
          onChangeText={handleUsernameChange}
          value={username}
          error={usernameError !== ''}
          supportingText={usernameError}
        />
        <TextField
          label='Password'
          onChangeText={handlePasswordChange}
          value={password}
          error={passwordError !== ''}
          supportingText={passwordError}
        />
      </View>
      <Button
        onPress={handleRegister}
        label='Continue'
        labelType='title-medium'
        style={{
          alignSelf: 'stretch',
          marginHorizontal: 32,
        }} />
    </SafeAreaView>
  );
}