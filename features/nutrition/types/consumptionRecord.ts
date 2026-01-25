import { Food } from "./food";
import { calcCaloricValue as calcMealCaloricValue, Meal } from "./meal";
import { UserFood } from "./userFood";

export interface ConsumptionRecord {
  id: string;
  foodId: string | null;
  food: Food | null;
  userFoodId: string | null;
  userFood: UserFood | null;
  userMealId: string | null;
  userMeal: Meal | null;
  quantity: number;
  time: number;
  modifiedAt: number;
  deleted: boolean;
}

export const calcCaloricValue = (record: ConsumptionRecord): number =>
  record.food
    ? (record.food.caloricValue * record.quantity) / 100
    : record.userFood
      ? (record.userFood.caloricValue * record.quantity) / 100
      : calcMealCaloricValue(record.userMeal!);

export interface AddConsumptionRecord {
  foodId?: string;
  userFoodId?: string;
  mealId?: string;
  quantity: number;
  time: number;
}
