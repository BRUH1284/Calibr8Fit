import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../hooks/useTheme";
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Ring = {
  color: string;
  backgroundColor?: string;
  progress: number; // 0..1
};

type Props = {
  size: number;
  strokeWidth: number;
  fill?: string;
  rings: Ring[];
  iconSize?: number;
  icons?: IconItem[];
};

type ComputedRing = {
  r: number;
  C: number;
  offset: number;
  bg?: string;
  stroke: string;
  dotX: number;
  dotY: number;
  dotR: number;
};

function clamp01(v: number) {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  return v;
}

function CircularProgressBase({
  size,
  strokeWidth,
  fill = "none",
  rings,
  icons = [],
  iconSize,
}: Props) {
  const theme = useTheme();

  // Precompute all ring geometry once per prop change.
  const computedRings = useMemo<ComputedRing[]>(() => {
    const list: ComputedRing[] = [];

    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      const ringSize = size - i * strokeWidth;
      // Centerline radius for this ring (keeps spacing consistent)
      const r = (ringSize - (i + 1) * strokeWidth) / 2;

      // Skip invalid/negative radii (too many rings for given size)
      if (r <= 0) continue;

      const C = 2 * Math.PI * r;
      const p = clamp01(ring.progress ?? 0);
      const offset = C * (1 - p);

      // Dot at the "start" (3 o'clock). The whole group is rotated -90°
      const dotX = size - (i + 0.5) * strokeWidth;
      const dotY = size / 2;
      const dotR = strokeWidth / 2;

      list.push({
        r,
        C,
        offset,
        bg: ring.backgroundColor,
        stroke: ring.color,
        dotX,
        dotY,
        dotR,
      });
    }

    return list;
  }, [rings, size, strokeWidth]);

  // Icon area sizing (kept stable & not mutating props)
  const iconContainerSize = useMemo(() => {
    const raw = ((size - rings.length * strokeWidth) / 2) * Math.SQRT2;
    return Math.max(0, raw);
  }, [size, rings.length, strokeWidth]);

  const resolvedIconSize = useMemo(() => {
    if (iconSize) return iconSize;
    const count = Math.max(1, icons.length);
    const perRow = Math.ceil(Math.sqrt(count));
    return (iconContainerSize / perRow) * 0.85;
  }, [iconSize, icons.length, iconContainerSize]);

  const iconWrapperStyle = useMemo(
    () => [
      styles.iconWrapper,
      {
        width: iconContainerSize,
        height: iconContainerSize,
        transform: [
          { translateX: -iconContainerSize / 2 },
          { translateY: -iconContainerSize / 2 },
        ],
        // Hint the platform to rasterize this static sub-tree
        ...(Platform.OS === "ios"
          ? { shouldRasterizeIOS: true as const }
          : { renderToHardwareTextureAndroid: true as const }),
      },
    ],
    [iconContainerSize],
  );

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg width={size} height={size} pointerEvents="none">
        {computedRings.map((g, index) => (
          <G key={index} rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              stroke={g.bg || theme.onSurfaceVariant}
              fill={fill}
              cx={size / 2}
              cy={size / 2}
              r={g.r}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke={g.stroke}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={g.r}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${g.C} ${g.C}`}
              strokeDashoffset={g.offset}
            />
            <Circle cx={g.dotX} cy={g.dotY} r={g.dotR} fill={g.stroke} />
          </G>
        ))}
      </Svg>

      {/* Center icons */}
      <View style={iconWrapperStyle}>
        <View style={styles.iconRow}>
          {icons.map((icon, i) => (
            <DynamicIcon
              key={`${icon.library}:${icon.name}:${i}`}
              name={icon.name}
              size={resolvedIconSize}
              library={icon.library}
              color={icon.color || theme.onSurface}
              style={icon.style}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// Simple memoization to avoid re-renders if inputs don’t change
function ringsEqual(a: Ring[], b: Ring[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ra = a[i];
    const rb = b[i];
    if (
      ra.progress !== rb.progress ||
      ra.color !== rb.color ||
      ra.backgroundColor !== rb.backgroundColor
    ) {
      return false;
    }
  }
  return true;
}

const CircularProgress = React.memo(
  CircularProgressBase,
  (prev, next) =>
    prev.size === next.size &&
    prev.strokeWidth === next.strokeWidth &&
    prev.fill === next.fill &&
    ringsEqual(prev.rings, next.rings) &&
    prev.iconSize === next.iconSize &&
    prev.icons === next.icons,
);

export default CircularProgress;

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  iconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
