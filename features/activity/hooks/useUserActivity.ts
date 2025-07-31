import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";

export const useUserActivity = () => {
    const context = useContext(ActivityContext);

    if (!context)
        throw new Error('useUserActivity must be used within ActivityProvider');
    return context;
}