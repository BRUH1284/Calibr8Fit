import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import TextField from "@/shared/components/TextField";
import { useState } from "react";
import { useConsumptionRecord } from "../hooks/useConsumptionRecord";
import { FoodMealItem } from "./FoodPopup";

type Props = {
  onDone: () => void;
  item: FoodMealItem;
};

interface Record {
  foodId?: string;
  userFoodId?: string;
  userMealId?: string;
  quantity: number; // in grams
  time: number; // timestamp
}

export default function FoodPopupCreateRecordContent({ onDone, item }: Props) {
  const { addConsumptionRecord } = useConsumptionRecord();

  const [createdRecord, setCreatedRecord] = useState<Record>({
    foodId: item.userFoodId || item.userMealId ? undefined : item.id,
    userFoodId: item.userFoodId,
    userMealId: item.userMealId,
    quantity: 100,
    time: Date.now(),
  });


  const handleAddConsumptionRecord = () => {
    addConsumptionRecord(createdRecord);
    onDone();
  }

  return (
    <>
      <AppText
        style={{
          textAlign: 'center',
        }}
        type='title-medium'
      >{item.name}</AppText>
      <TextField
        type='number'
        numberControls={true}
        label={'Grams'}
        value={createdRecord?.quantity.toString()}
        onChangeText={(value) => setCreatedRecord({
          ...createdRecord,
          quantity: parseInt(value)
        })}
        suffix='g'
        minValue={0}
        numberStep={100}
      />
      <IconButton
        onPress={handleAddConsumptionRecord}
        style={{ alignSelf: 'flex-end' }}
        icon={{
          name: 'check',
          size: 32,
          library: "MaterialIcons",
        }}
      />
    </>
  );
}