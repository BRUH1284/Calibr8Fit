import { Typography } from "@/styles/typography";
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";

type Props = {
    label?: string;
    labelType?: keyof typeof Typography;
    labelStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    variant?: 'filled' | 'text';
    onPress?: () => void;
};

export default function Button({ 
        variant = 'filled',
        label = "Button", 
        labelType = 'title-medium', 
        labelStyle, 
        style,
        onPress = () => {} 
    }: Props) {
    const theme = useTheme();

    const backgroundColor = variant === 'filled' ? theme.primary : "transparent";

    return (
        <TouchableOpacity
            style={[{
                backgroundColor: variant === 'filled' ? theme.primary : "transparent",
                padding: variant === 'filled' ? 16 : 6,
                borderRadius: 100,
                },
                style
            ]}
            onPress={onPress}
        >
            <AppText 
                type={labelType} 
                style={[
                    { 
                        color: variant === 'filled' ? theme.onPrimary : theme.primary, 
                        textAlign: 'center' 
                    }, 
                    labelStyle
            ]}>{label}</AppText>
        </TouchableOpacity>
    );
}