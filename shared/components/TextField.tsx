import { Typography } from "@/styles/typography";
import { useState } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";

type Props = {
    label?: string;
    error?: boolean;
    supportingText?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    onChangeText?: (text: string) => void;
    value?: string;
    keyboardType?: KeyboardTypeOptions;
}

export default function TextField({
    label,
    error,
    supportingText,
    secureTextEntry,
    autoCapitalize,
    onChangeText,
    value,
    keyboardType = "default",
}: Props) {
    const theme = useTheme();

    const [isFocused, setIsFocused] = useState(false);

    const focusedColor = error ? theme.error : theme.primary;

    return (
        <View style={{
            alignSelf: 'stretch',
            gap: 4
        }}>
        <View 
            style={{
                borderWidth: isFocused ? 3 : 1,
                paddingHorizontal: isFocused ? 13 : 15,
                paddingVertical: isFocused ? 9 : 11,
                borderColor: isFocused || error ? focusedColor : theme.outline,
                borderRadius: 4
            }}
            >
            { (isFocused || value) && <AppText 
                type='body-small'
                style={{
                    position: 'absolute',
                    left: isFocused ? 10 : 12,
                    top: isFocused ? -10 : -8,
                    color: isFocused || error ? focusedColor : theme.onSurfaceVariant,
                    backgroundColor: theme.background,
                    paddingHorizontal: 4,
                }}>{label}</AppText>}
            
            <TextInput
                style={[
                    Typography['body-large'],
                    {
                        padding: 0,
                        minHeight: 24
                    }]}
                    placeholder={!isFocused ? label : ''}
                    placeholderTextColor={theme.onSurfaceVariant}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    />
        </View>
            { supportingText !== undefined && <AppText 
                type='body-small'
                style={{
                    paddingHorizontal: 16,
                    color: error ? theme.error : theme.onSurfaceVariant
                }}
            >{supportingText}</AppText>}
        </View>
    );
}