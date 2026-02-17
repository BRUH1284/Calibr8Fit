import AppText from "@/shared/components/AppText";
import CompactNumberField from "@/shared/components/CompactNumberField";
import IconButton from "@/shared/components/IconButton";
import TextField from "@/shared/components/TextField";
import TextRowAdd from "@/shared/components/TextRowAdd";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useFood } from "../hooks/useFood";
import { useMeal } from "../hooks/useMeal";
import { useUserFood } from "../hooks/useUserFood";

interface Props {
  onDone: () => void;
}

interface FoodItem {
  id: string;
  userFoodId?: string;
  name: string;
  caloricValue: number;
}

export default function FoodPopupCreateFoodContent({ onDone }: Props) {
  const theme = useTheme();

  const { foods } = useFood();
  const { userFoods } = useUserFood();
  const { addMeal } = useMeal();

  const [ingredientMode, setAddIngredientMode] = useState(false);

  const [foodQuery, setFoodQuery] = useState("");
  const [ingredients, setIngredients] = useState<
    { food: FoodItem; quantityInGrams: number }[]
  >([]);
  const [createdMeal, setCreatedMeal] = useState({
    name: "",
    notes: "",
  });

  const combinedFoods = useMemo(() => {
    return [
      ...foods,
      ...userFoods.map((uf) => ({
        ...uf,
        userFoodId: uf.id,
      })),
    ] as FoodItem[];
  }, [foods, userFoods]);

  // Memoized arranged foods based on the search query
  const arrangedFoods = useMemo(() => {
    return combinedFoods
      .filter(
        ({ name, id }) =>
          name.toLowerCase().includes(foodQuery.toLowerCase()) &&
          ingredients.findIndex((ing) => ing.food.id === id) === -1,
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [combinedFoods, foodQuery, ingredients]);

  const addIngredient = useCallback((food: FoodItem) => {
    setIngredients((prev) => [...prev, { food, quantityInGrams: 0 }]);
    setAddIngredientMode(false);
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => {
      const idx = prev.findIndex((ing) => ing.food.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  }, []);

  const handleCreateMeal = useCallback(() => {
    addMeal({
      name: createdMeal.name,
      notes: createdMeal.notes,
      mealIngredients: ingredients.map((ing) => ({
        foodId: ing.food.userFoodId ? undefined : ing.food.id,
        userFoodId: ing.food.userFoodId ? ing.food.id : undefined,
        quantity: ing.quantityInGrams,
      })),
    });
    onDone();
  }, [createdMeal, ingredients]);

  return (
    <>
      {!ingredientMode ? (
        <>
          <TextField
            label={"Name"}
            value={createdMeal.name}
            onChangeText={(name) =>
              setCreatedMeal({
                ...createdMeal,
                name: name,
              })
            }
            numberOfLines={8}
          />
          <TextField
            label={"Notes"}
            value={createdMeal.notes}
            onChangeText={(notes) =>
              setCreatedMeal({
                ...createdMeal,
                notes: notes,
              })
            }
            multiline={true}
            numberOfLines={8}
          />
          <View style={styles.ingredientHeaderRow}>
            <AppText type="title-medium" style={styles.flex1}>
              Ingredients:
            </AppText>
            <AppText type="title-small">{`${ingredients.reduce(
              (sum, ing) =>
                sum +
                Math.floor((ing.quantityInGrams * ing.food.caloricValue) / 100),
              0,
            )} kcal`}</AppText>
            <IconButton
              icon={{
                name: "add",
                size: 24,
                library: "MaterialIcons",
              }}
              onPress={() => setAddIngredientMode(true)}
            />
          </View>
          <FlatList
            style={styles.flex1}
            data={ingredients}
            keyExtractor={(it) => it.food.id}
            renderItem={({ item }) => (
              <>
                <AppText type="body-large">{item.food.name}</AppText>
                <View style={styles.ingredientRow}>
                  <CompactNumberField
                    textAlign="right"
                    onChangeValue={(value) => {
                      const id = item.food.id;
                      setIngredients((prev) => {
                        const idx = prev.findIndex((ing) => ing.food.id === id);
                        if (idx === -1) return prev;

                        const target = prev[idx];
                        if (target.quantityInGrams === value) return prev; // no-op if unchanged

                        const next = [...prev];
                        next[idx] = { ...target, quantityInGrams: value }; // replace only this row
                        return next;
                      });
                    }}
                  />
                  <AppText
                    style={styles.ingredientLabel}
                    type="body-large"
                  >{`g = ${((item.food.caloricValue / 100) * item.quantityInGrams).toFixed(0)} kcal`}</AppText>
                  <IconButton
                    icon={{
                      name: "close",
                      size: 20,
                      library: "MaterialIcons",
                      color: theme.onErrorVariant,
                    }}
                    style={{
                      backgroundColor: theme.errorVariant,
                    }}
                    onPress={() => removeIngredient(item.food.id)}
                  />
                </View>
              </>
            )}
          />
          <IconButton
            onPress={handleCreateMeal}
            style={styles.selfEnd}
            icon={{
              name: "check",
              size: 32,
              library: "MaterialIcons",
            }}
          />
        </>
      ) : (
        <>
          <View style={styles.searchRow}>
            <IconButton
              icon={{
                name: "arrow-back",
                size: 32,
                library: "MaterialIcons",
              }}
              onPress={() => setAddIngredientMode(false)}
            />
            <TextField
              style={styles.searchField}
              label={"Search"}
              value={foodQuery}
              onChangeText={setFoodQuery}
            />
          </View>
          <FlatList
            initialNumToRender={10}
            contentContainerStyle={styles.listContent}
            data={arrangedFoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TextRowAdd
                label={item.name}
                onPress={() => addIngredient(item)}
                iconText={item.caloricValue.toString()}
              />
            )}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  ingredientHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  ingredientRow: {
    flexDirection: "row",
  },
  ingredientLabel: {
    textAlignVertical: "center",
    marginBottom: 4,
    flex: 1,
  },
  selfEnd: {
    alignSelf: "flex-end",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchField: {
    flex: 1,
    paddingBottom: 4,
  },
  listContent: {
    gap: 16,
  },
});
