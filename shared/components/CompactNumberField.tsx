import { Typography } from "@/styles/typography";
import { forwardRef, useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  label?: string;
  onChangeValue?: (value: number) => void;
  onSubmitEditing?: () => void;
  submitBehavior?: 'blurAndSubmit' | 'newline' | 'submit';
  textAlign?: "center" | "left" | "right";
  integer?: boolean;
  maxValue?: number;
  minValue?: number;
}

const CompactNumberField = forwardRef<TextInput, Props>(({
  label,
  onSubmitEditing,
  submitBehavior,
  onChangeValue,
  textAlign,
  integer = false,
  maxValue = Number.MAX_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
}, ref) => {
  const theme = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [displayedValue, setDisplayedValue] = useState<string>('');

  const handleChangeValue = useCallback((text: string) => {
    let filtered = text.replace(/[^0-9.-]/g, '');

    // ensure only one "-"
    if (minValue >= 0 || (filtered.match(/-/g) || []).length > 1) {
      filtered = filtered.replace(/(?!^)-/g, '');
    }

    // ensure "-" is only at the beginning
    if (filtered.includes('-') && filtered.indexOf('-') > 0) {
      filtered = filtered.replace(/-/g, '');
      filtered = '-' + filtered;
    }

    if (integer) filtered = filtered.replace(/\./g, '');

    // ensure only one "."
    if ((filtered.match(/\./g) || []).length > 1) {
      const firstDotIndex = filtered.indexOf('.');
      filtered =
        filtered.slice(0, firstDotIndex + 1) +
        filtered.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    if (filtered.endsWith('.')) {
      setDisplayedValue(filtered);
      return;
    }

    if (filtered === '') {
      setDisplayedValue(filtered);
      onChangeValue?.(0);
      return;
    }

    let numericValue = Number(filtered);

    if (numericValue > maxValue)
      numericValue = maxValue;
    else if (numericValue < minValue)
      numericValue = minValue;

    setDisplayedValue(numericValue.toString());
    onChangeValue?.(numericValue);
  }, [maxValue, minValue, onChangeValue]);

  return (
    <View style={{
    }}>
      <TextInput
        style={[Typography['body-large'],
        {
          height: 28,
          minWidth: 36,
          paddingVertical: 0,
          includeFontPadding: false,
          borderBottomWidth: 2,
          borderColor: isFocused ? theme.primary : theme.onSurfaceVariant,
          textAlign: textAlign,
        }]}
        ref={ref}
        placeholder={isFocused ? '' : label}
        placeholderTextColor={theme.onSurfaceVariant}
        onChangeText={handleChangeValue}
        value={displayedValue}
        keyboardType='number-pad'
        textAlign={textAlign}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        submitBehavior={submitBehavior}
      />
    </View>
  );
});

export default CompactNumberField;