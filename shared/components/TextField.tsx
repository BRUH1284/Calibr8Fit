import { Typography } from "@/styles/typography";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import Divider from "./Divider";
import IconButton from "./IconButton";

type Props = {
  label?: string;
  error?: boolean;
  supportingText?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  submitBehavior?: 'blurAndSubmit' | 'newline' | 'submit';
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  textAlign?: "center" | "left" | "right";
  suffix?: string;
  type?: 'text' | 'number' | 'password';
  maxValue?: number;
  minValue?: number;
  multiline?: boolean;
  numberOfLines?: number;
  numberControls?: boolean;
}

const TextField = forwardRef<TextInput, Props>(({
  label,
  error,
  supportingText,
  secureTextEntry,
  autoCapitalize,
  onChangeText,
  onSubmitEditing,
  submitBehavior,
  value = '',
  keyboardType,
  textAlign,
  suffix,
  type = 'text',
  maxValue = Number.MAX_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
  multiline = false,
  numberOfLines = 1,
  numberControls = false,
}, ref) => {
  const theme = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [valueState, setValueState] = useState<number>(0);
  const [displayedValue, setDisplayedValue] = useState<string>('');

  const focusedColor = error ? theme.error : theme.primary;

  const handleChangeValue = useCallback((value: string) => {

    if (value === '' || value.endsWith('-')) {
      setDisplayedValue(value ? '-' : '');
      setValueState(0);
      return;
    } else if (value.endsWith('.')) {
      setDisplayedValue(value);
      return;
    }

    let parsed = +value || 0;
    if (maxValue < parsed)
      parsed = maxValue;
    if (minValue > parsed)
      parsed = minValue;

    setValueState(parsed);
    onChangeText?.(parsed.toString());
    setDisplayedValue(parsed.toString());
  }, [maxValue, minValue, onChangeText]);

  useEffect(() => {
    if (type === 'number' && value !== valueState.toString()) {
      handleChangeValue(value);
    }
  }, [value]);

  return (
    <View style={{
      alignSelf: 'stretch',
      gap: 4,
    }}>
      <View
        style={{
          borderWidth: isFocused ? 3 : 1,
          paddingHorizontal: isFocused ? 13 : 15,
          paddingVertical: isFocused ? 9 : 11,
          borderColor: isFocused || error ? focusedColor : theme.outline,
          borderRadius: 4,
        }}
      >
        {(isFocused || (type === 'number' ? displayedValue : value)) && <AppText
          type='body-small'
          style={{
            position: 'absolute',
            left: isFocused ? 10 : 12,
            top: isFocused ? -10 : -8,
            color: isFocused || error ? focusedColor : theme.onSurfaceVariant,
            backgroundColor: theme.surface,
            paddingHorizontal: 4,
          }}>{label}</AppText>}

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={[
              Typography['body-large'],
              {
                padding: 0,
                minHeight: 24,
                flex: 1,
              }]}
            ref={ref}
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholder={isFocused ? '' : label}
            placeholderTextColor={theme.onSurfaceVariant}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            onChangeText={type === 'number' ? handleChangeValue : onChangeText}
            value={type === 'number' ? displayedValue : value}
            keyboardType={keyboardType}
            textAlign={textAlign}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            submitBehavior={submitBehavior}
          />
          {suffix && <AppText type='body-large' style={{ color: theme.onSurfaceVariant }}>{suffix}</AppText>}
          {numberControls && type === 'number' && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: isFocused ? -9 : -11,
                marginRight: -7,
                marginLeft: 8,
                gap: 8,
              }}
            >
              <Divider
                orientation='vertical'
                thickness={1}
                style={{ backgroundColor: isFocused || error ? focusedColor : theme.outline }}
              />
              <IconButton
                variant='icon'
                icon={{
                  name: 'remove',
                  size: 32,
                  library: 'MaterialIcons',
                  color: theme.onSurfaceVariant,
                }}
                onPress={() => handleChangeValue((valueState - 5).toString())}
              />
              <Divider
                orientation='vertical'
                thickness={1}
                style={{ backgroundColor: isFocused || error ? focusedColor : theme.outline }}
              />
              <IconButton
                variant='icon'
                icon={{
                  name: 'add',
                  size: 32,
                  library: 'MaterialIcons',
                  color: theme.onSurfaceVariant,
                }}
                onPress={() => handleChangeValue((valueState + 5).toString())}
              />
            </View>
          )}
        </View>
      </View>
      {supportingText !== undefined && <AppText
        type='body-small'
        style={{
          paddingHorizontal: 16,
          color: error ? theme.error : theme.onSurfaceVariant
        }}
      >{supportingText}</AppText>}
    </View>
  );
});

export default TextField;