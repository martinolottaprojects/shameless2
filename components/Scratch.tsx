import React, { useCallback, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedProps,
  useSharedValue,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Path, Mask, Rect } from 'react-native-svg';
import Colors from '@/constants/Colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const SCRATCH_THRESHOLD = 0.4; // 40% needs to be scratched
const windowWidth = Dimensions.get('window').width;
const imageSize = windowWidth * 0.8;

interface Position {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

interface ScratchProps {
  position: Position;
  onScratchComplete: () => void;
}

export const Scratch: React.FC<ScratchProps> = ({ position, onScratchComplete }) => {
  const path = useSharedValue('');
  const previousPoint = useSharedValue({ x: 0, y: 0 });
  const scratchedPixels = useSharedValue(0);
  const hasReachedThreshold = useSharedValue(false);
  const hasTriggeredComplete = useSharedValue(false);

  // Preload image
  useEffect(() => {
    if (position.image_url) {
      Image.prefetch(position.image_url);
    }
  }, [position.image_url]);

  const gesture = Gesture.Pan()
    .minDistance(0)
    .averageTouches(true)
    .onStart((e) => {
      previousPoint.value = { x: e.x, y: e.y };
      path.value += `M${e.x} ${e.y}`;
    })
    .onUpdate((e) => {
      const dx = e.x - previousPoint.value.x;
      const dy = e.y - previousPoint.value.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 2) { // Smaller threshold for more precise scratching
        path.value += ` L${e.x} ${e.y}`;
        previousPoint.value = { x: e.x, y: e.y };
        
        // Calculate scratched area more precisely
        const strokeArea = distance * 30; // Reduced stroke width
        scratchedPixels.value += strokeArea;
        
        const totalArea = imageSize * imageSize;
        const percentage = Math.min(scratchedPixels.value / totalArea, 1);
        
        // Just mark that we've reached the threshold, but don't complete yet
        if (percentage >= SCRATCH_THRESHOLD) {
          hasReachedThreshold.value = true;
        }
      }
    })
    .onFinalize(() => {
      // Only trigger completion when finger is lifted AND threshold was reached
      if (hasReachedThreshold.value && !hasTriggeredComplete.value) {
        hasTriggeredComplete.value = true;
        runOnJS(onScratchComplete)();
      }
    });

  const animatedProps = useAnimatedProps(() => ({
    d: path.value,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, { width: imageSize, height: imageSize }]}>
        <Image
          source={{ uri: position.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={StyleSheet.absoluteFill}>
          <GestureDetector gesture={gesture}>
            <Svg style={StyleSheet.absoluteFill}>
              <Mask id="mask">
                <Rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="white"
                />
                <AnimatedPath
                  animatedProps={animatedProps}
                  stroke="black"
                  strokeWidth={30}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Mask>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={Colors.primary}
                mask="url(#mask)"
              />
            </Svg>
          </GestureDetector>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
}); 