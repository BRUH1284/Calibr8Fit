import AppText from "@/shared/components/AppText";
import Button from "@/shared/components/Button";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";
import { Image } from 'expo-image';
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PADDING_BOTTOM = 32;


export default function UserInfo() {
  const theme = useTheme();
  const { register } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const refPagerView = useRef<PagerView>(null);

  const [gender, setGender] = useState<Gender | undefined>(undefined);

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const targetWeightRef = useRef<TextInput>(null);

  const [height, setHeight] = useState('');

  const [activityLevel, setActivityLevel] = useState<ActivityLevel | undefined>(undefined);

  const [climate, setClimate] = useState<Climate | undefined>(undefined);

  const handleContinueButton = () => {
    if (currentPage === 5) {

    } else {
      setCurrentPage(currentPage + 1);
      refPagerView.current?.setPage(currentPage);
    }
  }

  const useKeyboardAnimation = () => {
    const height = useSharedValue(PADDING_BOTTOM);

    useKeyboardHandler({
      onMove: (event) => {
        "worklet";
        height.value = Math.max(event.height, PADDING_BOTTOM);
      }
    }, []);

    return { height };
  }

  return (

    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: 32,
      gap: 32,
      backgroundColor: theme.background,
    }}>
      <Image style={{ height: '25%', alignSelf: 'stretch', backgroundColor: 'red' }}
        source={require('@/assets/images/react-logo.png')}
      />
      <PagerView
        ref={refPagerView}
        style={{ flex: 1 }}
        scrollEnabled={true}
        pageMargin={32}
      >
        <View key="1" style={styles.container}>
          <AppText
            type='headline-medum'
            style={{
              textAlign: 'center',
            }}>What is your gender?</AppText>
          <Button
            label='Male'
            labelType='title-medium'
            variant={gender === Gender.Male ? 'filled' : 'tonal'}
            onPress={() => setGender(Gender.Male)}
            style={{ marginHorizontal: 32 }}
          />
          <Button
            label='Female'
            labelType='title-medium'
            variant={gender === Gender.Female ? 'filled' : 'tonal'}
            onPress={() => setGender(Gender.Female)}
            style={{ marginHorizontal: 32 }}
          />
        </View>
        <View key="2" style={styles.container}>
          <AppText
            type='headline-medum'
            style={{
              textAlign: 'center',
            }}>What is your weight?</AppText>
          <TextField
            type='number'
            label='Current weight'
            onChangeText={setCurrentWeight}
            onSubmitEditing={() => targetWeightRef.current?.focus()}
            submitBehavior='submit'
            value={currentWeight}
            keyboardType='numeric'
            textAlign='right'
            suffix=' kg'
          />
          <TextField
            ref={targetWeightRef}
            label='Target weight'
            onChangeText={setTargetWeight}
            value={targetWeight}
            keyboardType='numeric'
            textAlign='right'
            suffix=' kg'
          />
          <View style={{ flex: 1 }} />
        </View>
        <View key="3" style={styles.container}>
          <AppText
            type='headline-medum'
            style={{
              textAlign: 'center',
            }}>What is your height?</AppText>
          <TextField
            type='number'
            label='Current height'
            onChangeText={setHeight}
            value={height}
            keyboardType='numeric'
            textAlign='right'
            suffix=' cm'
          />
        </View>
        <View key="4" style={styles.container}>
          <AppText
            type='headline-medum'
            style={{
              textAlign: 'center',
            }}>What is your activity level?</AppText>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <Button
              label='Sedentary'
              labelType='title-medium'
              variant={activityLevel === ActivityLevel.Sedentary ? 'filled' : 'tonal'}
              onPress={() => setActivityLevel(ActivityLevel.Sedentary)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='Light'
              labelType='title-medium'
              variant={activityLevel === ActivityLevel.Light ? 'filled' : 'tonal'}
              onPress={() => setActivityLevel(ActivityLevel.Light)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='Moderately'
              labelType='title-medium'
              variant={activityLevel === ActivityLevel.Moderately ? 'filled' : 'tonal'}
              onPress={() => setActivityLevel(ActivityLevel.Moderately)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='High'
              labelType='title-medium'
              variant={activityLevel === ActivityLevel.High ? 'filled' : 'tonal'}
              onPress={() => setActivityLevel(ActivityLevel.High)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='Extreme'
              labelType='title-medium'
              variant={activityLevel === ActivityLevel.Extreme ? 'filled' : 'tonal'}
              onPress={() => setActivityLevel(ActivityLevel.Extreme)}
              style={{ marginHorizontal: 32 }}
            />
          </ScrollView>
        </View>
        <View key="5" style={styles.container}>
          <AppText
            type='headline-medum'
            style={{
              textAlign: 'center',
            }}>What is your climate?</AppText>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <Button
              label='Cold'
              labelType='title-medium'
              variant={climate === Climate.Cold ? 'filled' : 'tonal'}
              onPress={() => setClimate(Climate.Cold)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='Temperate'
              labelType='title-medium'
              variant={climate === Climate.Temperate ? 'filled' : 'tonal'}
              onPress={() => setClimate(Climate.Temperate)}
              style={{ marginHorizontal: 32 }}
            />
            <Button
              label='Tropical'
              labelType='title-medium'
              variant={climate === Climate.Tropical ? 'filled' : 'tonal'}
              onPress={() => setClimate(Climate.Tropical)}
              style={{ marginHorizontal: 32 }}
            />
          </ScrollView>
        </View>
      </PagerView>
      <View>
        <Button
          label='Continue'
          labelType='title-medium'
          onPress={handleContinueButton}
          style={{ marginHorizontal: 32 }}
        />
        <Animated.View style={{ height: useKeyboardAnimation().height }} />
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  }
})