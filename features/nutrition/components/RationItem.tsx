import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type RationItemProps = {
  item: {
    id: string;
    name: string;
    quantity: number; // in grams
    calories: number;
    time: string;
  };
  onDelete: (id: string) => void;
};

const RationItem = memo(({ item, onDelete }: RationItemProps) => {
  const theme = useTheme();
  return (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <AppText
          type="title-medium"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </AppText>

        <AppText
          style={{ color: theme.onSurfaceVariant }}
          type='label-small'
        >
          {item.time}
        </AppText>
      </View>

      <Divider orientation="vertical" />

      <View style={styles.column}>
        <AppText style={styles.centerText} type="title-medium">
          {item.quantity}
        </AppText>
        <AppText
          style={styles.centerText}
          color="onSurfaceVariant"
          type="label-small"
        >
          Grams
        </AppText>
      </View>

      <View style={styles.column}>
        <AppText style={styles.centerText} type="title-medium">
          {item.calories}
        </AppText>
        <AppText
          style={styles.centerText}
          color="onSurfaceVariant"
          type="label-small"
        >
          Kcal
        </AppText>
      </View>

      <IconButton
        icon={{
          name: "delete-outline",
          library: "MaterialIcons",
          size: 32,
          color: theme.onSurface,
        }}
        style={{ backgroundColor: theme.tertiaryContainer }}
        onPress={() => onDelete(item.id)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 16,
  },
  column: {
    width: 48,
  },
  centerText: {
    textAlign: "center",
  },
});

export default RationItem;