import { IconItem } from "@/shared/components/DynamicIcon";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextButton from "@/shared/components/TextButton";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useFood } from "../hooks/useFood";
import { useMeal } from "../hooks/useMeal";
import { useUserFood } from "../hooks/useUserFood";
import { calcCaloricValue, FoodMealItem } from "../types/meal";
import FoodPopupCreateFoodContent from "./FoodPopupCreateFoodContent";
import FoodPopupCreateMealContent from "./FoodPopupCreateMealContent";

type Props = {
  onClose: () => void;
  onFoodSelect: (food: FoodMealItem) => void;
};

export default function FoodListPopupContent({ onClose, onFoodSelect }: Props) {
  const { foods, syncFoods } = useFood();
  const { userFoods, syncUserFoods } = useUserFood();
  const { meals } = useMeal();

  const [isCreationMode, setIsCreationMode] = useState(false);
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] = useState<{
    iconName: IconItem["name"];
    iconLibrary: IconItem["library"];
  }>();
  const [onHeaderRightIconPress, setOnHeaderRightIconPress] = useState<
    () => void
  >(() => {});
  const [onBackPress, setOnBackPress] = useState<() => void>(() => onClose);

  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // State for food search query
  const [foodQuery, setFoodQuery] = useState("");

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
      })),
    ] as FoodMealItem[];
  }, [foods, userFoods, meals]);
  // Memoized arranged foods based on the search query
  const arrangedFoodsAndMeals = useMemo(() => {
    return combinedFoods
      .filter(({ name, id }) =>
        name.toLowerCase().includes(foodQuery.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [combinedFoods, foodQuery]);

  // Handle refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncFoods();
    await syncUserFoods();
    setRefreshing(false);
  };

  const disableCreationMode = useCallback(() => {
    setHeader("Foods");
    setHeaderRightIcon({
      iconName: "pencil-plus",
      iconLibrary: "MaterialCommunityIcons",
    });
    setOnHeaderRightIconPress(() => enableCreationMode);
    setOnBackPress(() => onClose);
    setIsCreationMode(false);
  }, []);

  const enableCreationMode = useCallback(() => {
    setHeader("Create Food or Meal");
    setHeaderRightIcon(undefined);
    setOnHeaderRightIconPress(() => {});
    setOnBackPress(() => disableCreationMode);
    setIsCreationMode(true);
  }, []);

  useEffect(() => {
    disableCreationMode();
  }, []);

  return (
    <PopupContentBase
      header={header}
      onBackPress={onBackPress}
      headerRightIcon={headerRightIcon}
      onHeaderRightIconPress={onHeaderRightIconPress}
      children={
        isCreationMode ? (
          <>
            <View style={styles.toggleRow}>
              <TextButton
                label="Food"
                variant={currentPage === 0 ? "filled" : "toggle"}
                onPress={() => pagerRef.current?.setPage(0)}
                style={styles.toggleButton}
              />
              <TextButton
                label="Meal"
                variant={currentPage === 1 ? "filled" : "toggle"}
                onPress={() => pagerRef.current?.setPage(1)}
                style={styles.toggleButton}
              />
            </View>
            <PagerView
              ref={pagerRef}
              style={styles.pagerView}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              <View key="1" style={styles.pageContent}>
                <FoodPopupCreateFoodContent onDone={onClose} />
              </View>
              <View key="2" style={styles.pageContent}>
                <FoodPopupCreateMealContent onDone={onClose} />
              </View>
            </PagerView>
          </>
        ) : (
          <>
            <TextField
              label="Search"
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
              contentContainerStyle={styles.listContent}
              data={arrangedFoodsAndMeals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TextRowAdd
                  label={item.name}
                  onPress={() => onFoodSelect(item)}
                  iconText={`${item.caloricValue.toString()} kcal`}
                />
              )}
            />
          </>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    paddingVertical: 4,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  pagerView: {
    height: "91%",
    marginHorizontal: -16,
  },
  pageContent: {
    gap: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    gap: 16,
  },
});
