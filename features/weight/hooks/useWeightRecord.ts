import { useContext } from "react";
import { WeightRecordContext } from "../context/WeightRecordContext";

export const useWeightRecord = () => {
    const context = useContext(WeightRecordContext);

    if (!context)
        throw new Error('useWeightRecord must be used within WeightRecordProvider');

    return context;
}