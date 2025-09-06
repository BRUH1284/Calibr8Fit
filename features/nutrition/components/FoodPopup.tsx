import { IconItem } from "@/shared/components/DynamicIcon";
import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useFood } from "../hooks/useFood";
import { useUserFood } from "../hooks/useUserFood";

interface FoodItem {
  id: string;
  userFoodId?: string;
  name: string;
  caloricValue: number;
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FoodPopup({ visible, onClose }: Props) {
  const [mode, setMode] = useState<'food' | 'createFood' | 'foodRecord'>('food');
  const [header, setHeader] = useState<string>();
  const [headerRightIcon, setHeaderRightIcon] =
    useState<{ iconName: IconItem['name'], iconLibrary: IconItem['library'] }>();
  const [onRightButtonPress, setOnRightButtonPress] = useState<() => void>(() => { });

  const { foods, syncFoods } = useFood();
  const { userFoods, syncUserFoods, addUserFood } = useUserFood();

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

  // Memoized arranged foods based on the search query
  const arrangedFoods = useMemo(() => {
    const combined = [
      ...foods,
      ...userFoods.map((uf) => ({
        ...uf,
        userFoodId: uf.id
      }))
    ] as FoodItem[];

    return combined
      .filter(({ name }) =>
        name.toLowerCase().includes(foodQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foods, userFoods, foodQuery]);

  // State for adding user food
  const [createdFood, setCreatedFood] = useState({
    name: '',
    caloricValue: 0,
    fat: 0,
    saturatedFats: 0,
    monounsaturatedFats: 0,
    polyunsaturatedFats: 0,
    carbohydrates: 0,
    sugars: 0,
    protein: 0,
    dietaryFiber: 0,
    water: 0,
    cholesterol: 0,
    sodium: 0,
    vitaminA: 0,
    vitaminB1Thiamine: 0,
    vitaminB11FolicAcid: 0,
    vitaminB12: 0,
    vitaminB2Riboflavin: 0,
    vitaminB3Niacin: 0,
    vitaminB5PantothenicAcid: 0,
    vitaminB6: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    calcium: 0,
    copper: 0,
    iron: 0,
    magnesium: 0,
    manganese: 0,
    phosphorus: 0,
    potassium: 0,
    selenium: 0,
    zinc: 0,
    nutritionDensity: 0,
  });

  const setFoodMode = useCallback(() => {
    setMode('food');
    setHeader('Foods');
    setHeaderRightIcon({
      iconName: 'pencil-plus',
      iconLibrary: 'MaterialCommunityIcons'
    });
    setOnRightButtonPress(() => setFoodCreationMode);
  }, []);

  const setFoodCreationMode = useCallback(() => {
    setMode('createFood');
    setHeader('Create Food');
    setHeaderRightIcon(undefined);
  }, []);

  const handleCreateFood = useCallback(() => {
    addUserFood({
      name: createdFood.name,
      caloricValue: createdFood.caloricValue ? createdFood.caloricValue : 0,

      fat: 0,
      saturatedFats: 0,
      monounsaturatedFats: 0,
      polyunsaturatedFats: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      dietaryFiber: 0,
      water: 0,
      cholesterol: 0,
      sodium: 0,
      vitaminA: 0,
      vitaminB1Thiamine: 0,
      vitaminB11FolicAcid: 0,
      vitaminB12: 0,
      vitaminB2Riboflavin: 0,
      vitaminB3Niacin: 0,
      vitaminB5PantothenicAcid: 0,
      vitaminB6: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      calcium: 0,
      copper: 0,
      iron: 0,
      magnesium: 0,
      manganese: 0,
      phosphorus: 0,
      potassium: 0,
      selenium: 0,
      zinc: 0,
      nutritionDensity: 0,
    });

    // Reset the created food state
    setCreatedFood({
      name: '',
      caloricValue: 0,
      fat: 0,
      saturatedFats: 0,
      monounsaturatedFats: 0,
      polyunsaturatedFats: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      dietaryFiber: 0,
      water: 0,
      cholesterol: 0,
      sodium: 0,
      vitaminA: 0,
      vitaminB1Thiamine: 0,
      vitaminB11FolicAcid: 0,
      vitaminB12: 0,
      vitaminB2Riboflavin: 0,
      vitaminB3Niacin: 0,
      vitaminB5PantothenicAcid: 0,
      vitaminB6: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      calcium: 0,
      copper: 0,
      iron: 0,
      magnesium: 0,
      manganese: 0,
      phosphorus: 0,
      potassium: 0,
      selenium: 0,
      zinc: 0,
      nutritionDensity: 0,
    });

    setFoodMode();
  }, [createdFood]);

  useEffect(() => {
    if (visible) {
      setFoodMode();
    }
  }, [visible]);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      onBackPress={mode === 'food' ? onClose : setFoodMode}
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
            data={arrangedFoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.name}
                onPress={() => { }}
                iconText={item.caloricValue.toString()}
              />
            )}
          />
        </>
      }
      {(mode === 'createFood') &&
        <>
          <TextField
            label={'Name'}
            value={createdFood.name}
            onChangeText={(name) => setCreatedFood(({
              ...createdFood,
              name: name
            }))}
            multiline={true}
            numberOfLines={8}
          />
          <TextField
            type='number'
            label={'Caloric Value'}
            value={createdFood.caloricValue?.toString()}
            onChangeText={(value) => setCreatedFood(({
              ...createdFood,
              caloricValue: parseFloat(value)
            }))}
            suffix={`kcal`}
            minValue={0}
          />
          <IconButton
            onPress={handleCreateFood}
            style={{ alignSelf: 'flex-end' }}
            icon={{
              name: 'check',
              size: 32,
              library: "MaterialIcons",
            }}
          />
        </>
      }
    </Popup>
  );
}