import { useContext } from "react";
import { ConsumptionRecordContext } from "../context/ConsumptionRecordContext";

export const useConsumptionRecord = () => {
    const context = useContext(ConsumptionRecordContext);

    if (!context)
        throw new Error('useConsumptionRecord must be used within ConsumptionRecordProvider');

    return context;
}
