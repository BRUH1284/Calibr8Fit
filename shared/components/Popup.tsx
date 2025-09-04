import { ReactNode } from "react";
import { Modal, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./AppText";
import { IconItem } from "./DynamicIcon";
import IconButton from "./IconButton";

type Props = {
  header?: string;
  visible?: boolean;
  onClose: () => void;
  onBackPress: () => void;
  headerRightIcon?: { iconName: IconItem['name'], iconLibrary: IconItem['library'] };
  onHeaderRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export default function Popup({
  header,
  visible: isVisible = true,
  onClose,
  onBackPress,
  headerRightIcon,
  onHeaderRightIconPress,
  containerStyle,
  children
}: Props) {
  const theme = useTheme();

  return (
    <Modal
      statusBarTranslucent={true}
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      onDismiss={onClose}
      style={{
      }}
    >
      <Pressable
        onPress={onClose}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: theme.dialogBackground
        }} />

      <View
        style={{
          backgroundColor: theme.surface,
          margin: 32,
          maxHeight: '66%',
          marginTop: '66%',
          borderRadius: 16,
          padding: 16,
          gap: 16
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            onPress={onBackPress}
            variant='icon'
            icon={{ name: 'arrow-back-ios', library: 'MaterialIcons', size: 24 }}
            style={{ position: 'absolute' }}
          />
          <AppText
            type='title-large'
            style={{
              flex: 1,
              textAlign: 'center',
              marginHorizontal: 32,
            }}
          >{header}</AppText>
          {headerRightIcon && <IconButton
            onPress={onHeaderRightIconPress}
            variant='icon'
            icon={{ name: headerRightIcon.iconName, library: headerRightIcon.iconLibrary, size: 24 }}
            style={{ position: 'absolute', right: 0 }}
          />}
        </View>
        <View
          style={[{
            gap: 16,
            flexShrink: 1,
          }, containerStyle]}
        >{children}</View>

      </View>
    </Modal >
  );
}