import { useContext } from "react";
import { WaterIntakeContext } from "../context/WaterIntakeContext";

export const useWaterIntake = () => {
    const context = useContext(WaterIntakeContext);

    if (!context)
        throw new Error('useWaterIntake must be used within WaterIntakeProvider');

    return context;
}