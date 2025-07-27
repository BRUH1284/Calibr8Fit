import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from "../hooks/useTheme";
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Ring = {
  color: string;
  backgroundColor?: string;
  progress: number;
  progressStart?: number;
};

type Props = {
  size: number
  strokeWidth: number,
  fill?: string,
  animationDuration?: number;
  rings: Ring[];
  iconSize?: number;
  icons?: IconItem[];
};


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  size,
  strokeWidth,
  fill = "none",
  animationDuration = 1000,
  rings,
  icons = [],
  iconSize = 24,
}: Props) {
  const theme = useTheme();

  const iconContainerSize = (size - rings.length * strokeWidth) / 2 * Math.SQRT2;
  iconSize = iconSize || iconContainerSize / Math.ceil(Math.sqrt(icons.length)) * 0.85;;
  return (
    <View style={{
      width: size,
      height: size,
      position: 'relative',
      margin: 32
    }}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const progressStart = ring.progressStart || 0;
          const progress = useSharedValue(progressStart);

          React.useEffect(() => {
            progress.value = withTiming(ring.progress, { duration: animationDuration });
          }, [ring.progress]);

          const ringSize = size - index * strokeWidth;
          const ringRadius = (ringSize - (index + 1) * strokeWidth) / 2;
          const ringCircumference = ringRadius * 2 * Math.PI;

          const animatedProps = useAnimatedProps(() => {
            const strokeDashoffset =
              (ringCircumference - (ringCircumference * progress.value));
            return {
              strokeDashoffset: strokeDashoffset,
            };
          });

          const dotX = ringSize - strokeWidth / 2;
          const dotY = size / 2;
          const dotR = strokeWidth / 2;


          return (
            <G key={index} rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                stroke={ring.backgroundColor || theme.surfaceVariant}
                fill={fill}
                cx={size / 2}
                cy={size / 2}
                r={ringRadius}
                strokeWidth={strokeWidth}
              />
              <AnimatedCircle
                stroke={ring.color}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={ringRadius}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${ringCircumference}, ${ringCircumference}`}
                animatedProps={animatedProps}
              />
              <Circle
                cx={dotX}
                cy={dotY}
                r={dotR}
                fill={ring.color}
              />
            </G>
          );
        })}
      </Svg>
      {/* Center icon */}
      <View style={{
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: '50%',
        left: '50%',
        width: iconContainerSize,
        height: iconContainerSize,
        transform: [
          { translateX: -iconContainerSize / 2 },
          { translateY: -iconContainerSize / 2 }
        ]
      }}>
        {icons.map((icon, index) =>
          <DynamicIcon
            key={index}
            name={icon.name}
            size={iconSize}
            library={icon.library}
            color={icon.color || theme.onSurface}
            style={icon.style}
          />)}
      </View>
    </View>
  );
}