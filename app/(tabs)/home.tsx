import ActivitiesPopup from '@/features/activity/components/ActivitiesPopup';
import { useActivityRecord } from '@/features/activity/hooks/useActivityRecord';
import WaterIntakeRecordPopup from '@/features/hydration/components/WaterIntakeRecordPopup';
import { useWaterIntake } from '@/features/hydration/hooks/useWaterIntake';
import FoodPopup from '@/features/nutrition/components/FoodPopup';
import { useConsumptionRecord } from '@/features/nutrition/hooks/useConsumptionRecord';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useRecommendations } from '@/features/profile/hooks/useRecommendations';
import AppText from '@/shared/components/AppText';
import IconAddProgressIndicator from '@/shared/components/IconAddProgressIndicator';
import IconButton from '@/shared/components/IconButton';
import { useTheme } from '@/shared/hooks/useTheme';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Index() {
  const theme = useTheme();

  const [showActivities, setShowActivities] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showWaterIntake, setShowWaterIntake] = useState(false);

  const { profileSettings } = useProfile();
  const { waterIntake, burnTarget, consumptionTarget } = useRecommendations();
  const { todayWaterIntakeInMl } = useWaterIntake();
  const { todayCaloriesConsumed } = useConsumptionRecord();
  const { todayCaloriesBurned } = useActivityRecord();

  const burnProgress = burnTarget ? Math.min(todayCaloriesBurned / burnTarget, 1) : 1;
  const rationProgress = consumptionTarget ? Math.min(todayCaloriesConsumed / consumptionTarget, 1) : 0;
  const waterProgress = todayWaterIntakeInMl / 1000 / waterIntake;

  return (
    <>
      <ScrollView contentContainerStyle={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.surface,
        gap: 8,
      }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <AppText
            type='headline-medium'
          >{`Hi ${profileSettings?.firstName}`}</AppText>
          <IconButton
            icon={{
              name: 'search',
              library: 'MaterialIcons',
              size: 24,
            }}
            variant='icon'
          />
        </View>
        <IconAddProgressIndicator
          progress={burnProgress}
          icon={{
            name: 'local-fire-department',
            library: 'MaterialIcons',
            size: 24,
          }}
          onAddPress={() => setShowActivities(true)}
        />
        <IconAddProgressIndicator
          progress={rationProgress}
          icon={{
            name: 'fastfood',
            library: 'MaterialIcons',
            size: 24,
          }}
          onAddPress={() => setShowFood(true)}
        />
        <IconAddProgressIndicator
          progress={waterProgress}
          icon={{
            name: 'water-drop',
            library: 'MaterialIcons',
            size: 24,
          }}
          onAddPress={() => setShowWaterIntake(true)}
        />

      </ScrollView>
      <FoodPopup
        visible={showFood}
        onClose={() => setShowFood(false)}
      />
      <ActivitiesPopup
        visible={showActivities}
        onClose={() => setShowActivities(false)}
      />
      <WaterIntakeRecordPopup
        visible={showWaterIntake}
        onClose={() => setShowWaterIntake(false)}
      />
    </>
  );
}
