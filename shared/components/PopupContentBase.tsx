import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { IconItem } from "./DynamicIcon";
import IconButton from "./IconButton";

type Props = {
  header?: string;
  onBackPress: () => void;
  headerRightIcon?: {
    iconName: IconItem["name"];
    iconLibrary: IconItem["library"];
  };
  onHeaderRightIconPress?: () => void;
  children?: React.ReactNode;
};

export default function PopupContentBase({
  header,
  onBackPress,
  headerRightIcon,
  onHeaderRightIconPress,
  children,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <IconButton
          onPress={onBackPress}
          variant="icon"
          icon={{ name: "arrow-back-ios", library: "MaterialIcons", size: 24 }}
          style={styles.leftIcon}
        />
        <AppText type="title-large" style={styles.headerText}>
          {header}
        </AppText>
        {headerRightIcon && (
          <IconButton
            onPress={onHeaderRightIconPress}
            variant="icon"
            icon={{
              name: headerRightIcon.iconName,
              library: headerRightIcon.iconLibrary,
              size: 24,
            }}
            style={styles.rightIcon}
          />
        )}
      </View>
      <View style={styles.childrenContainer}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 32,
  },
  leftIcon: { position: "absolute", left: 0 },
  rightIcon: { position: "absolute", right: 0 },
  childrenContainer: {
    gap: 16,
    flexShrink: 1,
  },
});
