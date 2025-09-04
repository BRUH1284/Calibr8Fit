import IconButton from "@/shared/components/IconButton";
import Popup from "@/shared/components/Popup";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { useWaterIntake } from "../hooks/useWaterIntake";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function WaterIntakeRecordPopup({ visible, onClose }: Props) {
  const { addWaterIntakeRecord } = useWaterIntake();
  const [waterIntakeInMl, setWaterIntakeInMl] = useState<number>(0);

  const handleAddWaterIntakeRecord = useCallback(() => {
    addWaterIntakeRecord({
      time: Date.now(),
      amountInMl: waterIntakeInMl,
    });

    // Reset the water intake state
    setWaterIntakeInMl(0);

    onClose();
  }, [waterIntakeInMl]);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      onBackPress={onClose}
      header={'Add Water Intake Record'}
    >
      <>
        <TextField
          type='number'
          numberControls={true}
          label={'Mililiters'}
          value={waterIntakeInMl.toString()}
          onChangeText={(value) => setWaterIntakeInMl(parseInt(value))}
          suffix='ml'
          minValue={0}
          numberStep={100}
        />
        <IconButton
          onPress={handleAddWaterIntakeRecord}
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