import { useCallback, useEffect, useState } from "react";
import { Pressable, Switch, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import DynamicIcon, { IconItem } from "./DynamicIcon";
import Popup from "./Popup";
import TextButton from "./TextButton";
import TextField from "./TextField";

type BaseProps = {
  icon: IconItem;
  label: string;
};

type BooleanSettingProps = BaseProps & {
  type: "boolean";
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type NumberSettingProps = BaseProps & {
  type: "number";
  value: number | null;
  onValueChange: (value: number | null) => void;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  integer?: boolean;
};

type Props = BooleanSettingProps | NumberSettingProps;

export default function SettingsItem(props: Props) {
  const theme = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [tempValue, setTempValue] = useState<number | null>(
    props.type === "number" ? props.value : 0,
  );

  // Update temp value when popup opens
  useEffect(() => {
    if (showPopup && props.type === "number") {
      setTempValue(props.value);
    }
  }, [showPopup, props]);

  const handlePress = useCallback(() => {
    if (props.type === "number") {
      setTempValue(props.value);
      setShowPopup(true);
    }
  }, [props]);

  const handleSave = useCallback(() => {
    if (props.type === "number") {
      props.onValueChange(tempValue);
      setShowPopup(false);
    }
  }, [props, tempValue]);

  const handleCancel = useCallback(() => {
    setShowPopup(false);
    if (props.type === "number") {
      setTempValue(props.value);
    }
  }, [props]);

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 8,
      }}
    >
      <DynamicIcon
        name={props.icon.name}
        library={props.icon.library}
        size={props.icon.size || 24}
        color={props.icon.color}
      />
      <AppText type="title-medium" style={{ flex: 1 }}>
        {props.label}
      </AppText>
      {props.type === "boolean" && (
        <Switch
          trackColor={{ false: theme.outline, true: theme.primary }}
          thumbColor={props.value ? theme.onPrimary : theme.surfaceContainer}
          onValueChange={props.onValueChange}
          value={props.value}
        />
      )}
      {props.type === "number" && (
        <AppText
          type="title-medium"
          style={{
            color: theme.onSurfaceVariant,
            textDecorationLine: "underline",
          }}
        >
          {props.value !== null ? (
            <>
              {props.value}
              {props.unit && ` ${props.unit}`}
            </>
          ) : (
            "Not set"
          )}
        </AppText>
      )}
    </View>
  );

  if (props.type === "number") {
    return (
      <>
        <Pressable onPress={handlePress}>{content}</Pressable>
        <Popup visible={showPopup} onClose={handleCancel}>
          <AppText type="title-large" style={{ textAlign: "center" }}>
            {props.label}
          </AppText>
          <TextField
            label={props.label}
            type="number"
            value={tempValue !== null ? tempValue.toString() : ""}
            onChangeText={(text) => {
              if (text === "" || text === "-") {
                setTempValue(null);
              } else {
                const num = parseFloat(text);
                setTempValue(isNaN(num) ? null : num);
              }
            }}
            suffix={props.unit}
            textAlign="center"
            keyboardType="numeric"
            maxValue={props.maxValue}
            minValue={props.minValue}
            numberControls={true}
            numberStep={
              props.maxValue && props.maxValue <= 100
                ? 1
                : props.maxValue && props.maxValue <= 1000
                  ? 10
                  : 100
            }
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextButton
              label="Cancel"
              variant="tonal"
              style={{ flex: 1 }}
              onPress={handleCancel}
            />
            <TextButton
              label="Save"
              variant="filled"
              style={{ flex: 1 }}
              onPress={handleSave}
            />
          </View>
        </Popup>
      </>
    );
  }

  return content;
}
