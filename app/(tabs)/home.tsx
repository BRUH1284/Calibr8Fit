import ActivitiesListPopupContent from '@/features/activity/components/ActivitiesListPopupContent';
import ActivityRecordPopupContent from '@/features/activity/components/ActivityRecordPopupContent';
import DailyBurnProgressList from '@/features/activity/components/DailyBurnProgressList';
import { useActivityRecord } from '@/features/activity/hooks/useActivityRecord';
import { ActivityItem } from '@/features/activity/types/activityRecord';
import WaterIntakeRecordPopupContent from '@/features/hydration/components/WaterIntakeRecordPopupContent';
import { useWaterIntake } from '@/features/hydration/hooks/useWaterIntake';
import FoodListPopupContent from '@/features/nutrition/components/FoodListPopupContent';
import FoodRecordPopupContent from '@/features/nutrition/components/FoodRecordPopupContent';
import { useConsumptionRecord } from '@/features/nutrition/hooks/useConsumptionRecord';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useRecommendations } from '@/features/profile/hooks/useRecommendations';
import AppText from '@/shared/components/AppText';
import IconAddProgressIndicator from '@/shared/components/IconAddProgressIndicator';
import IconButton from '@/shared/components/IconButton';
import Popup from '@/shared/components/Popup';
import { useTheme } from '@/shared/hooks/useTheme';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Index() {
  const theme = useTheme();

  const [popupContent, setPopupContent] = useState<React.ReactNode>();

  const openFoodPopup = useCallback(() => {
    setPopupContent(
      <FoodListPopupContent
        onClose={() => setPopupContent(undefined)}
        onFoodSelect={(item) => setPopupContent(
          <FoodRecordPopupContent
            item={item}
            onClose={() => setPopupContent(undefined)}
          />
        )}
      />
    );
  }, []);

  const openActivitiesPopup = useCallback(() => {
    setPopupContent(
      <ActivitiesListPopupContent
        onClose={() => setPopupContent(undefined)}
        onActivitySelect={(item: ActivityItem) => setPopupContent(
          <ActivityRecordPopupContent
            activity={item}
            onClose={() => setPopupContent(undefined)}
          />
        )}
      />
    );
  }, []);

  const openWaterIntakePopup = useCallback(() => {
    setPopupContent(
      <WaterIntakeRecordPopupContent
        onClose={() => setPopupContent(undefined)}
      />
    );
  }, []);

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
          onAddPress={openActivitiesPopup}
        />
        <IconAddProgressIndicator
          progress={rationProgress}
          icon={{
            name: 'fastfood',
            library: 'MaterialIcons',
            size: 24,
          }}
          onAddPress={openFoodPopup}
        />
        <IconAddProgressIndicator
          progress={waterProgress}
          icon={{
            name: 'water-drop',
            library: 'MaterialIcons',
            size: 24,
          }}
          onAddPress={openWaterIntakePopup}
        />
        <DailyBurnProgressList />

      </ScrollView>
      <Popup
        visible={!!popupContent}
        onClose={() => setPopupContent(undefined)}
        children={popupContent}
      />
    </>
  );
}
