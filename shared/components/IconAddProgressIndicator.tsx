import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import DynamicIcon, { IconItem } from "./DynamicIcon";
import IconButton from "./IconButton";
import ProgressIndicator from "./ProgressIndicator";

type Props = {
  progress: number;
  icon: IconItem;
  onAddPress?: () => void;
}

export default function IconAddProgressIndicator({
  progress,
  icon,
  onAddPress = () => { },
}: Props) {
  const theme = useTheme();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }}>
      <DynamicIcon
        name={icon.name}
        library={icon.library}
        size={icon.size}
        color={icon.color}
      />
      <ProgressIndicator
        color={theme.primary}
        backgroundColor={theme.surfaceContainer}
        progress={progress}
      />
      <IconButton
        icon={{
          name: 'add',
          library: 'MaterialIcons',
          color: theme.onPrimaryVariant,
          size: icon.size,
        }}
        style={{
          padding: 0,
          backgroundColor: theme.primaryVariant
        }}
        onPress={onAddPress}
      />
    </View>
  );
}