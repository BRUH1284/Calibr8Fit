import { useContext } from "react";
import { MealContext } from "../context/MealContext";

export const useMeal = () => {
    const context = useContext(MealContext);

    if (!context)
        throw new Error('useMeal must be used within MealProvider');

    return context;
}
