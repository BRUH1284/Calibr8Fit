import AppText from "@/shared/components/AppText";
import DynamicIcon, { IconItem } from "@/shared/components/DynamicIcon";
import SearchPopup from "@/shared/components/SearchPopup";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Overview() {
  const theme = useTheme();

  const [popup, setPopup] = useState<'none' | 'activity'>('none');

  const tiles: {
    iconName: string;
    iconLibrary: IconItem['library'];
    mainText: string;
    supportingText: string;
    onPress?: () => void;
  }[] = [
      {
        iconName: 'fastfood',
        iconLibrary: 'MaterialIcons',
        mainText: 'Tile 1',
        supportingText: 'Supporting text 1',

      },
      {
        iconName: 'local-fire-department',
        iconLibrary: 'MaterialIcons',
        mainText: 'Tile 2',
        supportingText: 'Supporting text 1',
        onPress() {
          setPopup('activity');
        },
      },
      { iconName: 'water-drop', iconLibrary: 'MaterialIcons', mainText: 'Tile 3', supportingText: 'Supporting text 1' },
      { iconName: 'monitor-weight', iconLibrary: 'MaterialIcons', mainText: '80 kg', supportingText: '75 kg' },
    ];

  return (
    <View style={{ flex: 1 }}>


      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.surface,
          gap: 16,
        }}
      >
        <View style={{
          height: 144,
          backgroundColor: theme.surfaceContainer,
          marginHorizontal: 16,
          borderRadius: 16,
          flexDirection: 'row',
        }} >
          <View style={{ flex: 1 }} />
        </View>
        <FlatList
          style={{
            paddingHorizontal: 16,
            flexGrow: 0,
          }}
          contentContainerStyle={{ gap: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          numColumns={2}
          data={tiles}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: theme.surfaceContainer,
                padding: 16,
                borderRadius: 16,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={item.onPress}
            >
              <DynamicIcon
                name={item.iconName}
                size={32}
                library={item.iconLibrary}
                color={theme.onSurface} />

              <View style={{ flex: 1 }}>
                <AppText type='label-large' style={{ textAlign: 'right' }}>{item.mainText}</AppText>
                <AppText type='label-small' style={{ textAlign: 'right', color: theme.onSurfaceVariant }}>{item.supportingText}</AppText>
              </View>
            </TouchableOpacity>
          )}>
        </FlatList>
        <View style={{
          flex: 1,
          marginHorizontal: 16,
        }} >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surfaceContainer,
              borderRadius: 16,
            }} />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            padding: 4,
          }}>
            <View style={[styles.circleIndicator, { backgroundColor: theme.onSurfaceVariant }]} />
            <View style={[styles.circleIndicator, { backgroundColor: theme.surfaceContainer }]} />
            <View style={[styles.circleIndicator, { backgroundColor: theme.surfaceContainer }]} />
          </View>
        </View>
      </View >

      <SearchPopup
        isVisible={popup === 'activity'}
        onClose={() => setPopup('none')}
        header='Add activity'
        headerRightIcon={{ iconName: 'pencil-plus', iconLibrary: 'MaterialCommunityIcons' }}
        flatListData={[
          { id: 1, name: 'Running', description: 'Jogging for 30 minutes' },
          { id: 2, name: 'Cycling', description: 'Biking for 1 hour' },
          { id: 3, name: 'Swimming', description: 'Swimming laps for 45 minutes' },
          { id: 4, name: 'Yoga', description: '30 minutes of yoga' },
          { id: 5, name: 'Weightlifting', description: 'Full body workout' },
          { id: 6, name: 'Cycling', description: 'Biking for 1 hour' },
          { id: 7, name: 'Swimming', description: 'Swimming laps for 45 minutes' },
          { id: 8, name: 'Yoga', description: '30 minutes of yoga' },
          { id: 9, name: 'Weightlifting', description: 'Full body workout' },
          { id: 10, name: 'Walking', description: 'Casual walk in the park' },
          { id: 11, name: 'Running', description: 'Jogging for 30 minutes' },
          { id: 12, name: 'Cycling', description: 'Biking for 1 hour' },
          { id: 13, name: 'Swimming', description: 'Swimming laps for 45 minutes' },
          { id: 14, name: 'Yoga', description: '30 minutes of yoga' },
          { id: 15, name: 'Weightlifting', description: 'Full body workout' },
          { id: 16, name: 'Cycling', description: 'Biking for 1 hour' },
          { id: 17, name: 'Swimming', description: 'Swimming laps for 45 minutes' },
          { id: 18, name: 'Yoga', description: '30 minutes of yoga' },
          { id: 19, name: 'Weightlifting', description: 'Full body workout' },]}
        flatListRenderItem={({ name, description }: any) => (
          <TextRowAdd
            label={name}
            onPress={() => console.log(`Selected ${name}`)}
            iconText={description} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circleIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
  }
});