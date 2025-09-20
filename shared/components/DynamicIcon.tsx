import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const iconLibraries = {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6
};

export type IconLibraryName = keyof typeof iconLibraries;

export type IconItem = {
  name: string;
  size?: number;
  library: IconLibraryName;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default function DynamicIcon({ name, size, library, color, style }: IconItem) {
  const theme = useTheme();
  const IconLib = iconLibraries[library];
  return <IconLib
    name={name as any}
    size={size}
    color={color || theme.onSurface}
    style={style} />;
}
