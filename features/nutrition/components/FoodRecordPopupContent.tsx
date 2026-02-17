import AppText from "@/shared/components/AppText";
import IconButton from "@/shared/components/IconButton";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextField from "@/shared/components/TextField";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useConsumptionRecord } from "../hooks/useConsumptionRecord";
import { FoodMealItem } from "../types/meal";

interface Record {
  foodId?: string;
  userFoodId?: string;
  userMealId?: string;
  quantity: number; // in grams
  time: number; // timestamp
}

type Props = {
  item: FoodMealItem;
  onClose: () => void;
};

export default function FoodRecordPopupContent({ onClose, item }: Props) {
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
    onClose();
  };

  return (
    <PopupContentBase header="Add Weight Record" onBackPress={onClose}>
      <>
        <AppText style={styles.textCenter} type="title-medium">
          {item.name}
        </AppText>
        <TextField
          type="number"
          numberControls={true}
          label={"Grams"}
          value={createdRecord?.quantity.toString()}
          onChangeText={(value) =>
            setCreatedRecord({
              ...createdRecord,
              quantity: parseInt(value),
            })
          }
          suffix="g"
          minValue={0}
          numberStep={100}
        />
        <IconButton
          onPress={handleAddConsumptionRecord}
          style={styles.selfEnd}
          icon={{
            name: "check",
            size: 32,
            library: "MaterialIcons",
          }}
        />
      </>
    </PopupContentBase>
  );
}

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
  },
  selfEnd: {
    alignSelf: "flex-end",
  },
});
