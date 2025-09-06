import { useContext } from "react";
import { FoodContext } from "../context/FoodContext";

export const useFood = () => {
    const context = useContext(FoodContext);

    if (!context)
        throw new Error('useFood must be used within FoodProvider');
    return context;
}
