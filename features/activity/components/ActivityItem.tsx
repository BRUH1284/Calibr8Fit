import AppText from "@/shared/components/AppText";
import Divider from "@/shared/components/Divider";
import IconButton from "@/shared/components/IconButton";
import { useTheme } from "@/shared/hooks/useTheme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type ActivityItemProps = {
  item: {
    id: string;
    description: string;
    duration: number; // in minutes
    calories: number;
    time?: string;
  };
  onDelete: (id: string) => void;
};

const ActivityItem = memo(({ item, onDelete }: ActivityItemProps) => {
  const theme = useTheme();
  return (
    <View style={styles.listItem}>
      <View style={styles.flex1}>
        <AppText type="title-medium" numberOfLines={1} ellipsizeMode="tail">
          {item.description}
        </AppText>

        {item.time && (
          <AppText style={{ color: theme.onSurfaceVariant }} type="label-small">
            {item.time}
          </AppText>
        )}
      </View>

      <Divider orientation="vertical" />

      <View style={styles.column}>
        <AppText style={styles.centerText} type="title-medium">
          {item.duration / 60}
        </AppText>
        <AppText
          style={styles.centerText}
          color="onSurfaceVariant"
          type="label-small"
        >
          Minutes
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
          color: theme.onErrorVariant,
        }}
        style={{ backgroundColor: theme.errorVariant }}
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
  flex1: {
    flex: 1,
  },
});

export default ActivityItem;
