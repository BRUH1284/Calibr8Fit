import { useContext } from "react";
import { UserFoodContext } from "../context/UserFoodContext";

export const useUserFood = () => {
    const context = useContext(UserFoodContext);

    if (!context)
        throw new Error('useUserFood must be used within UserFoodProvider');
    return context;
}
