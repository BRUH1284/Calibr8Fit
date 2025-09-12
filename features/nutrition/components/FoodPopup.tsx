import { IconItem } from "@/shared/components/DynamicIcon";
import Popup from "@/shared/components/Popup";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useFood } from "../hooks/useFood";
import { useMeal } from "../hooks/useMeal";
import { useUserFood } from "../hooks/useUserFood";
import { calcCaloricValue } from "../types/meal";
import FoodPopupCreateFoodContent from "./FoodPopupCreateFoodContent";
import FoodPopupCreateMealContent from "./FoodPopupCreateMealContent";
import FoodPopupCreateRecordContent from "./FoodPopupCreateRecordContent";

export interface FoodMealItem {
  id: string;
  userFoodId?: string;
  userMealId?: string;
  name: string;
  caloricValue: number;
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FoodPopup({ visible, onClose }: Props) {
  const theme = useTheme();

  const [mode, setMode] = useState<'food' | 'creation' | 'record'>('food');
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onRightButtonPress, setOnRightButtonPress] = useState<() => void>(() => { });

  const { foods, syncFoods } = useFood();
  const { userFoods, syncUserFoods } = useUserFood();
  const { meals } = useMeal();

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncFoods();
    await syncUserFoods();
    setRefreshing(false);
  };

  // State for food search query
  const [foodQuery, setFoodQuery] = useState('');

  const combinedFoods = useMemo(() => {
    return [
      ...foods,
      ...userFoods.map((uf) => ({
        ...uf,
        userFoodId: uf.id,
      })),
      ...meals.map((m) => ({
        ...m,
        userMealId: m.id,
        caloricValue: calcCaloricValue(m),
      }))
    ] as FoodMealItem[];
  }, [foods, userFoods, meals]);
  // Memoized arranged foods based on the search query
  const arrangedFoodsAndMeals = useMemo(() => {
    //console.log(combinedFoods);
    return combinedFoods
      .filter(({ name, id }) =>
        name.toLowerCase().includes(foodQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [combinedFoods, foodQuery]);

  const setFoodMode = useCallback(() => {
    setMode('food');
    setHeader('Foods');
    setHeaderRightIcon({
      iconName: 'pencil-plus',
      iconLibrary: 'MaterialCommunityIcons'
    });
    setOnRightButtonPress(() => setCreationMode);
  }, []);

  const setCreationMode = useCallback(() => {
    setMode('creation');
    setHeader('Create Food or Meal');
    setHeaderRightIcon(undefined);
  }, []);

  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodMealItem | undefined>(undefined);

  const createRecord = useCallback((recordItem: FoodMealItem) => {
    setSelectedFoodItem(recordItem);
    setMode('record');
    setHeader('Add Record');
    setHeaderRightIcon(undefined);
  }, []);

  const close = useCallback(() => {
    onClose();
    setFoodQuery('');
  }, [onClose, setFoodMode]);

  useEffect(() => {
    if (visible)
      setFoodMode();
  }, [visible]);

  return (
    <Popup
      visible={visible}
      onClose={close}
      onBackPress={mode === 'food' ? close : setFoodMode}
      header={header}
      headerRightIcon={headerRightIcon}
      onHeaderRightIconPress={onRightButtonPress}
    >
      {(mode === 'food') &&
        <>
          <TextField
            label={'Search'}
            value={foodQuery}
            onChangeText={setFoodQuery}
          />
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            initialNumToRender={10}
            contentContainerStyle={{ gap: 16 }}
            data={arrangedFoodsAndMeals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.name}
                onPress={() => createRecord(item)}
                iconText={`${item.caloricValue.toString()} kcal`}
              />
            )}
          />
        </>
      }
      {(mode === 'creation') &&
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 16
            }}>
            <TextButton
              label='Food'
              variant={currentPage === 0 ? 'filled' : 'toggle'}
              onPress={() => pagerRef.current?.setPage(0)}
              style={styles.toggleButton}
            />
            <TextButton
              label='Meal'
              variant={currentPage === 1 ? 'filled' : 'toggle'}
              onPress={() => pagerRef.current?.setPage(1)}
              style={styles.toggleButton}
            />
          </View>
          <PagerView
            ref={pagerRef}
            style={{ height: '91%', marginHorizontal: -16 }}
            onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
            <View key="1" style={{ gap: 16, paddingHorizontal: 16 }}>
              <FoodPopupCreateFoodContent onDone={close} />
            </View>
            <View key="2" style={{ gap: 16, paddingHorizontal: 16 }}>
              <FoodPopupCreateMealContent onDone={close} />
            </View>
          </PagerView>
        </>}
      {(mode === 'record' && selectedFoodItem) &&
        <FoodPopupCreateRecordContent
          item={selectedFoodItem}
          onDone={close}
        />}
    </Popup>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    paddingVertical: 4,
  },
})