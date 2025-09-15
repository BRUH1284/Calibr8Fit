import IconButton from "@/shared/components/IconButton";
import PopupContentBase from "@/shared/components/PopupContentBase";
import TextField from "@/shared/components/TextField";
import { useCallback, useState } from "react";
import { useWaterIntake } from "../hooks/useWaterIntake";

type Props = {
  onClose: () => void;
};

export default function WaterIntakeRecordPopupContent({ onClose }: Props) {
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
    <PopupContentBase
      header='Add Water Intake Record'
      onBackPress={onClose}
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
    </PopupContentBase>
  );
}