import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import AppText from "@/shared/components/AppText";
import FrameDisplay from "@/shared/components/FrameDisplay";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePageValidation } from "@/shared/hooks/usePageValidation";
import { useTheme } from "@/shared/hooks/useTheme";
import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserInfo() {
  const theme = useTheme();
  const { setUserInfo } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const refPagerView = useRef<PagerView>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const lastNameRef = useRef<TextInput>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [gender, setGender] = useState<Gender | undefined>(undefined);

  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const targetWeightRef = useRef<TextInput>(null);
  const [height, setHeight] = useState("");
  const heightRef = useRef<TextInput>(null);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel | undefined>(
    undefined,
  );

  const [climate, setClimate] = useState<Climate | undefined>(undefined);

  // Use the validation hook
  const isCurrentPageValid = usePageValidation(currentPage, {
    0: () =>
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      dateOfBirth !== undefined,
    1: () => gender !== undefined,
    2: () =>
      !isNaN(parseFloat(currentWeight)) &&
      !isNaN(parseFloat(targetWeight)) &&
      !isNaN(parseFloat(height)),
    3: () => activityLevel !== undefined,
    4: () => climate !== undefined,
  });

  const handleContinueButton = () => {
    // Don't continue if current page is not valid
    if (!isCurrentPageValid) return;

    if (currentPage === 4) {
      setUserInfo(
        {
          firstName,
          lastName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
          targetWeight: parseFloat(targetWeight),
          height: parseFloat(height),
          gender: Gender.Male,
          activityLevel: ActivityLevel.Sedentary,
          climate: Climate.Tropical,
        } as ProfileSettings,
        parseFloat(currentWeight),
      );
    } else {
      refPagerView.current?.setPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/react-logo.png")}
      />
      <PagerView
        ref={refPagerView}
        style={{ flex: 1 }}
        scrollEnabled={false}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1" style={[styles.container, { gap: 4 }]}>
          <View style={styles.gap4}>
            <AppText type="headline-medium" style={styles.textCenter}>
              Let's build your profile.
            </AppText>
            <AppText
              type="body-large"
              style={[styles.textCenter, { color: theme.onSurfaceVariant }]}
            >
              Used for account setup and tailored fitness recommendations.
            </AppText>
          </View>
          <KeyboardAwareScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            bottomOffset={32}
          >
            <TextField
              label="First name"
              onChangeText={setFirstName}
              onSubmitEditing={() => lastNameRef.current?.focus()}
              submitBehavior="submit"
              value={firstName}
            />
            <TextField
              ref={lastNameRef}
              label="Last name"
              onChangeText={setLastName}
              onSubmitEditing={() => setShowDatePicker(true)}
              value={lastName}
            />
            <FrameDisplay
              placeholder="Date of birth"
              focused={showDatePicker}
              value={
                dateOfBirth
                  ? `${dateOfBirth?.getDay().toString()}, ${
                      dateOfBirth?.getMonth() + 1
                    }, ${dateOfBirth?.getFullYear()}`
                  : ""
              }
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? dateOfBirth : new Date()}
                onChange={(event, date) => {
                  if (date) {
                    setDateOfBirth(date);
                  }
                  setShowDatePicker(false);
                }}
                display="spinner"
              />
            )}
          </KeyboardAwareScrollView>
        </View>
        <View key="2" style={styles.container}>
          <View style={styles.gap4}>
            <AppText type="headline-medium" style={styles.textCenter}>
              What is your gender?
            </AppText>
            <AppText
              type="body-large"
              style={[styles.textCenter, { color: theme.onSurfaceVariant }]}
            >
              We use this to personalize your goals, hydration, and health
              insights.
            </AppText>
          </View>
          <TextButton
            label="Male"
            labelType="title-medium"
            variant={gender === Gender.Male ? "filled" : "toggle"}
            onPress={() => setGender(Gender.Male)}
            style={styles.button}
          />
          <TextButton
            label="Female"
            labelType="title-medium"
            variant={gender === Gender.Female ? "filled" : "toggle"}
            onPress={() => setGender(Gender.Female)}
            style={styles.button}
          />
        </View>
        <View key="3" style={styles.container}>
          <View style={styles.gap4}>
            <AppText type="headline-medium" style={styles.textCenter}>
              What are your body stats?
            </AppText>
            <AppText
              type="body-large"
              style={[styles.textCenter, { color: theme.onSurfaceVariant }]}
            >
              Your current and target stats help us calculate calories burned
              and set goals.
            </AppText>
          </View>
          <KeyboardAwareScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            bottomOffset={32}
          >
            <TextField
              type="number"
              label="Current weight"
              onChangeText={setCurrentWeight}
              onSubmitEditing={() => targetWeightRef.current?.focus()}
              submitBehavior="submit"
              value={currentWeight}
              keyboardType="numeric"
              textAlign="right"
              suffix=" kg"
              minValue={0}
            />
            <TextField
              type="number"
              ref={targetWeightRef}
              label="Target weight"
              onChangeText={setTargetWeight}
              onSubmitEditing={() => heightRef.current?.focus()}
              value={targetWeight}
              keyboardType="numeric"
              submitBehavior="submit"
              textAlign="right"
              suffix=" kg"
              minValue={0}
            />
            <TextField
              type="number"
              ref={heightRef}
              label="Height"
              onChangeText={setHeight}
              value={height}
              keyboardType="numeric"
              textAlign="right"
              suffix=" cm"
              minValue={0}
            />
          </KeyboardAwareScrollView>
        </View>
        <View key="4" style={styles.container}>
          <View style={styles.gap4}>
            <AppText type="headline-medium" style={styles.textCenter}>
              What's your usual activity level?
            </AppText>
            <AppText
              type="body-large"
              style={[styles.textCenter, { color: theme.onSurfaceVariant }]}
            >
              This helps us estimate your calorie burn and hydration needs.
            </AppText>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <TextButton
              label="Sedentary"
              labelType="title-medium"
              variant={
                activityLevel === ActivityLevel.Sedentary ? "filled" : "toggle"
              }
              onPress={() => setActivityLevel(ActivityLevel.Sedentary)}
              style={styles.button}
            />
            <TextButton
              label="Light"
              labelType="title-medium"
              variant={
                activityLevel === ActivityLevel.Light ? "filled" : "toggle"
              }
              onPress={() => setActivityLevel(ActivityLevel.Light)}
              style={styles.button}
            />
            <TextButton
              label="Moderately"
              labelType="title-medium"
              variant={
                activityLevel === ActivityLevel.Moderately ? "filled" : "toggle"
              }
              onPress={() => setActivityLevel(ActivityLevel.Moderately)}
              style={styles.button}
            />
            <TextButton
              label="High"
              labelType="title-medium"
              variant={
                activityLevel === ActivityLevel.High ? "filled" : "toggle"
              }
              onPress={() => setActivityLevel(ActivityLevel.High)}
              style={styles.button}
            />
            <TextButton
              label="Extreme"
              labelType="title-medium"
              variant={
                activityLevel === ActivityLevel.Extreme ? "filled" : "toggle"
              }
              onPress={() => setActivityLevel(ActivityLevel.Extreme)}
              style={styles.button}
            />
          </ScrollView>
        </View>
        <View key="5" style={styles.container}>
          <View style={styles.gap4}>
            <AppText type="headline-medium" style={styles.textCenter}>
              What's the weather like where you are?
            </AppText>
            <AppText
              type="body-large"
              style={[styles.textCenter, { color: theme.onSurfaceVariant }]}
            >
              Climate affects how much water your body needs — we’ll factor that
              in.
            </AppText>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <TextButton
              label="Cold"
              labelType="title-medium"
              variant={climate === Climate.Cold ? "filled" : "toggle"}
              onPress={() => setClimate(Climate.Cold)}
              style={styles.button}
            />
            <TextButton
              label="Temperate"
              labelType="title-medium"
              variant={climate === Climate.Temperate ? "filled" : "toggle"}
              onPress={() => setClimate(Climate.Temperate)}
              style={styles.button}
            />
            <TextButton
              label="Tropical"
              labelType="title-medium"
              variant={climate === Climate.Tropical ? "filled" : "toggle"}
              onPress={() => setClimate(Climate.Tropical)}
              style={styles.button}
            />
          </ScrollView>
        </View>
      </PagerView>
      <TextButton
        label={currentPage === 4 ? "Complete" : "Continue"}
        labelType="title-medium"
        onPress={handleContinueButton}
        style={[styles.button, { marginHorizontal: 64 }]}
        enabled={isCurrentPageValid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 32,
    gap: 32,
  },
  logo: {
    height: "20%",
    alignSelf: "stretch",
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    gap: 16,
    marginHorizontal: 32,
  },
  gap4: {
    gap: 4,
  },
  textCenter: {
    textAlign: "center",
  },
  scrollContent: {
    flex: 1,
    paddingTop: 12,
  },
  scrollContentContainer: {
    gap: 16,
  },
  button: {
    marginHorizontal: 32,
  },
});
