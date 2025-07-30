import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { Image } from 'expo-image';
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const theme = useTheme();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameError('');
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError('');
  };

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error: any) {
      const cause = error?.cause;

      setUsernameError(cause.UserName || '');
      setPasswordError(cause.Password || '');
      setErrorMessage(cause[0] || '');
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 32,
      gap: 32,
      justifyContent: 'flex-end',
      alignContent: 'center',
      backgroundColor: theme.background
    }}>
      <Image style={{ height: 288, alignSelf: 'stretch', backgroundColor: 'red' }}
        source={require('@/assets/images/react-logo.png')}
      />
      <AppText type='headline-medum' style={{ textAlign: 'center' }}>Sign in to Calibr8Fit</AppText>
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
        <Divider />
        <AppText type='title-small' color='onSurfaceVariant' style={{ textAlign: 'center', fontWeight: '500' }}>Don’t have an account?</AppText>
        <TextButton
          onPress={() => router.push('/sign-up')}
          variant='text'
          label='Sign up'
          labelType='label-large'
        />
        <AppText type='label-large' style={{
          flex: 1,
          verticalAlign: 'bottom',
          color: theme.error,
          textAlign: 'center'
        }}>{errorMessage}</AppText>
      </View>
      <TextButton
        onPress={handleLogin}
        label='Continue'
        labelType='title-medium'
        style={{
          alignSelf: 'stretch',
          marginHorizontal: 32
        }} />
    </SafeAreaView>
  );
}