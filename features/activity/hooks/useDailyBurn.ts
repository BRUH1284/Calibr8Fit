import { useContext } from "react";
import { DailyBurnContext } from "../context/DailyBurnContext";

export const useDailyBurn = () => {
    const context = useContext(DailyBurnContext);

    if (!context)
        throw new Error('useDailyBurn must be used within DailyBurnProvider');

    return context;
}