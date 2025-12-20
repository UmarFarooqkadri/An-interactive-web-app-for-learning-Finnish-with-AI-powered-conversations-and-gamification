import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText, Polygon } from 'react-native-svg';

const DEFAULT_SEGMENTS = [
  { label: 'Numbers', color: '#58CC02' },     // Primary green
  { label: 'Weekdays', color: '#1CB0F6' },    // Bright blue
  { label: 'Directions', color: '#FFD900' },  // Yellow
  { label: 'Greetings', color: '#FF9600' },   // Orange
  { label: 'Cities', color: '#89E219' },      // Light green
  { label: 'Introduction', color: '#1899D6' }, // Dark blue
];

const WHEEL_SIZE = 600;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;

const FortuneWheel = ({ onSpinEnd, segments = DEFAULT_SEGMENTS }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const currentRotation = useRef(0);

  const getSegmentPath = (index, total) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = startAngle + angle;

    const x1 = CENTER + RADIUS * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * Math.sin(startAngle);
    const x2 = CENTER + RADIUS * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index, total) => {
    const angle = (2 * Math.PI) / total;
    const midAngle = index * angle + angle / 2 - Math.PI / 2;
    const textRadius = RADIUS * 0.65;

    return {
      x: CENTER + textRadius * Math.cos(midAngle),
      y: CENTER + textRadius * Math.sin(midAngle),
      rotation: (midAngle * 180) / Math.PI + 90,
    };
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomSpins = 5 + Math.random() * 5;
    const randomExtraAngle = Math.random() * 360;
    const totalRotation = randomSpins * 360 + randomExtraAngle;

    const newRotation = currentRotation.current + totalRotation;

    Animated.timing(spinValue, {
      toValue: newRotation,
      duration: 4000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      currentRotation.current = newRotation;
      setIsSpinning(false);

      const normalizedAngle = (newRotation % 360 + 360) % 360;
      const segmentAngle = 360 / segments.length;
      const adjustedAngle = (360 - normalizedAngle + segmentAngle / 2) % 360;
      const selectedIndex = Math.floor(adjustedAngle / segmentAngle);

      if (onSpinEnd) {
        onSpinEnd(segments[selectedIndex]);
      }
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointerContainer}>
        <Svg width={60} height={45} viewBox="0 0 40 30">
          <Polygon
            points="20,30 0,0 40,0"
            fill="#C0392B"
            stroke="#922B21"
            strokeWidth="2"
          />
        </Svg>
      </View>

      {/* Wheel */}
      <Animated.View style={[styles.wheelContainer, { transform: [{ rotate: spin }] }]}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {/* Outer ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 5}
            fill="#2C3E50"
            stroke="#1A252F"
            strokeWidth="3"
          />

          {/* Wheel segments */}
          <G>
            {segments.map((segment, index) => (
              <Path
                key={index}
                d={getSegmentPath(index, segments.length)}
                fill={segment.color}
                stroke="#2C3E50"
                strokeWidth="2"
              />
            ))}
          </G>

          {/* Segment labels */}
          {segments.map((segment, index) => {
            const pos = getTextPosition(index, segments.length);
            return (
              <SvgText
                key={`text-${index}`}
                x={pos.x}
                y={pos.y}
                fill="#2C3E50"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
              >
                {segment.label}
              </SvgText>
            );
          })}

          {/* Decorative dots around the wheel */}
          {Array.from({ length: 24 }).map((_, index) => {
            const angle = (index * 2 * Math.PI) / 24 - Math.PI / 2;
            const dotRadius = RADIUS + 2;
            const x = CENTER + dotRadius * Math.cos(angle);
            const y = CENTER + dotRadius * Math.sin(angle);
            return (
              <Circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r={4}
                fill="#F1C40F"
              />
            );
          })}
        </Svg>

        {/* Center spin button */}
        <TouchableOpacity
          style={styles.spinButton}
          onPress={spinWheel}
          disabled={isSpinning}
          activeOpacity={0.8}
        >
          <View style={styles.spinButtonInner}>
            <Text style={styles.spinButtonText}>
              {isSpinning ? '...' : 'SPIN'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerContainer: {
    position: 'absolute',
    top: -5,
    zIndex: 10,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F39C12',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  spinButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E67E22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#D35400',
  },
  spinButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default FortuneWheel;
