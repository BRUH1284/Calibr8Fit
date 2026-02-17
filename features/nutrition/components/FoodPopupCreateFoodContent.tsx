import IconButton from "@/shared/components/IconButton";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useUserFood } from "../hooks/useUserFood";

type Props = {
  onDone: () => void;
};

const defaultFood = {
  name: "",
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
};

export default function FoodPopupCreateFoodContent({ onDone }: Props) {
  const { addUserFood } = useUserFood();

  const [createdFood, setCreatedFood] = useState(defaultFood);

  const handleCreateFood = useCallback(() => {
    addUserFood({
      ...defaultFood,
      ...createdFood,
    });

    // Reset the created food state
    setCreatedFood(defaultFood);

    onDone();
  }, [createdFood]);

  return (
    <>
      <TextField
        label={"Name"}
        value={createdFood.name}
        onChangeText={(name) =>
          setCreatedFood({
            ...createdFood,
            name: name,
          })
        }
        multiline={true}
        numberOfLines={8}
      />
      <TextField
        type="number"
        label={"Caloric Value"}
        value={createdFood.caloricValue?.toString()}
        onChangeText={(value) =>
          setCreatedFood({
            ...createdFood,
            caloricValue: parseFloat(value),
          })
        }
        suffix={`kcal`}
        minValue={0}
      />
      <IconButton
        onPress={handleCreateFood}
        style={styles.selfEnd}
        icon={{
          name: "check",
          size: 32,
          library: "MaterialIcons",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  selfEnd: {
    alignSelf: "flex-end",
  },
});
