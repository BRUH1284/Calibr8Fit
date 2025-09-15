import IconButton from "@/shared/components/IconButton";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { useWeightRecord } from "../hooks/useWeightRecord";

type Props = {
  onClose: () => void;
};

export default function WeightRecordPopupContent({ onClose }: Props) {
  const { weight: currentWeight, addWeightRecord } = useWeightRecord();
  const [weight, setWeight] = useState<number>(currentWeight);

  const handleAddWeightRecordRecord = useCallback(() => {
    addWeightRecord({
      time: Date.now(),
      weight,
    });

    onClose();
  }, [weight]);

  return (
    <PopupContentBase
      header='Add Weight Record'
      onBackPress={onClose}
    >
      <>
        <TextField
          type='number'
          numberControls={true}
          label='Weight'
          value={weight.toString()}
          onChangeText={(value) => setWeight(parseFloat(value))}
          suffix='kg'
          minValue={0}
          numberStep={1}
        />
        <IconButton
          onPress={handleAddWeightRecordRecord}
          style={{ alignSelf: 'flex-end' }}
          icon={{
            name: 'check',
            size: 32,
            library: "MaterialIcons",
          }}
        />
      </>
    </PopupContentBase>
  );
}