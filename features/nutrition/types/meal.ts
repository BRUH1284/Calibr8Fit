import { Food } from "./food";
import { UserFood } from "./userFood";

export interface Meal {
    id: string;

    name: string;
    notes: string | null;
    mealIngredients: MealIngredient[];

    modifiedAt: number;
    deleted: boolean;
}

export const calcCaloricValue = (meal: Meal): number =>
    meal.mealIngredients.reduce((sum, item) => {
        const src = item.food ?? item.userFood;
        return sum + (src ? (src.caloricValue * item.quantity) / 100 : 0);
    }, 0);

export interface MealIngredient {
    id: string;
    userMealId: string;
    foodId?: string; // Either foodId or userFoodId must be set, but not both
    userFoodId?: string;
    food?: Food;
    userFood?: UserFood;
    quantity: number;
}

export interface AddMeal {
    name: string;
    notes?: string | null;
    mealIngredients: {
        foodId?: string;
        userFoodId?: string;
        quantity: number;
    }[];
}

export interface FoodMealItem {
    id: string;
    userFoodId?: string;
    userMealId?: string;
    name: string;
    caloricValue: number;
}
