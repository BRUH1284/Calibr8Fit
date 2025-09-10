export interface Meal {
    id: string;

    name: string;
    notes: string | null;
    mealIngredients: MealIngredient[];

    modifiedAt: number;
    deleted: boolean;
}

export interface MealIngredient {
    id: string;
    userMealId: string;
    foodId?: string; // Either foodId or userFoodId must be set, but not both
    userFoodId?: string;
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