import { memo, useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

const GAP = 4;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const ProgressIndicator = memo(
  ({
    progress,
    height = 4,
    color = "#6200EE",
    backgroundColor = "#E0E0E0",
    style,
  }: Props) => {
    const containerWidth = useSharedValue(0);
    const p = useSharedValue(clamp01(progress));

    useEffect(() => {
      const target = clamp01(progress);
      p.value = withTiming(target, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }, [progress]);

    const trackStyle = useAnimatedStyle(() => {
      const w = containerWidth.value;
      const offset = Math.min(GAP / 2, p.value * w);

      return {
        transform: [
          { translateX: w / 2 },
          { scaleX: 1 - p.value - (1 / w) * (offset + height / 2) },
          { translateX: -w / 2 },
        ],
      };
    });

    const trackCapStyle = useAnimatedStyle(() => {
      const w = containerWidth.value;
      const offset = Math.min(GAP / 2, p.value * w);

      return {
        transform: [{ translateX: w * p.value + offset }],
      };
    });

    const barStyle = useAnimatedStyle(() => {
      const w = containerWidth.value;

      return {
        transform: [
          { translateX: -w / 2 },
          { scaleX: p.value - ((1 / w) * (GAP + height)) / 2 },
          { translateX: w / 2 },
        ],
      };
    });

    const barCapStyle = useAnimatedStyle(() => {
      const w = containerWidth.value;

      return {
        transform: [{ translateX: w * p.value - height - GAP / 2 }],
      };
    });

    return (
      <View style={[styles.container, style]}>
        <View
          style={[
            styles.track,
            {
              height,
              borderRadius: height / 2,
            },
          ]}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            containerWidth.value = w;
          }}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                height,
                backgroundColor: color,
              },
              barStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.fill,
              {
                height,
                backgroundColor: backgroundColor,
              },
              trackStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.fill,
              trackCapStyle,
              {
                height,
                width: height,
                borderRadius: height / 2,
                backgroundColor: backgroundColor,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.fill,
              barCapStyle,
              {
                height,
                width: height,
                borderRadius: height / 2,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.fill,
              {
                right: 0,
                height,
                width: height,
                borderRadius: height / 2,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexShrink: 1,
  },
  track: {
    overflow: "hidden",
    flex: 1,
  },
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default ProgressIndicator;
