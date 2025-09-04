import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { useWeightRecord } from "../hooks/useWeightRecord";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function WeightRecordPopup({ visible, onClose }: Props) {
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
    <Popup
      visible={visible}
      onClose={onClose}
      onBackPress={onClose}
      header={'Add Weight Record'}
    >
      <>
        <TextField
          type='number'
          numberControls={true}
          label={'Weight'}
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
    </Popup>
  );
}