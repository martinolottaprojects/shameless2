import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { ActionButton } from '@/components/ActionButton';
import Colors from '@/constants/Colors';
import { LogoIcon } from '@/components/LogoIcon';
import { Scratch } from '@/components/Scratch';
import React, { useState } from 'react';
import Animated, { 
  withSpring, 
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

// Mock data for testing
const mockPosition = {
  id: '1',
  name: 'Test Position',
  image_url: 'https://picsum.photos/400',
  created_at: new Date().toISOString(),
};

export default function Feed() {
  const [showButtons, setShowButtons] = useState(false);
  const [hasInitialLayout, setHasInitialLayout] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withSpring(
        showButtons ? -50 : 0,
        {
          damping: 15,
          stiffness: 100,
          mass: 0.5,
        }
      ),
    }],
  }));

  const handleScratchComplete = () => {
    setHasInitialLayout(true);
    setTimeout(() => {
      setShowButtons(true);
    }, 100);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <View style={styles.logoContainer}>
              <LogoIcon />
              <Text style={styles.logoText}>Shameless</Text>
            </View>
          ),
          headerRight: () => null,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={[
            styles.mainContainer,
            (showButtons || hasInitialLayout) && styles.mainContainerWithButtons
          ]}>
            <Animated.View style={[
              styles.cardWrapper,
              hasInitialLayout && animatedStyle
            ]}>
              <Scratch
                position={mockPosition}
                onScratchComplete={handleScratchComplete}
              />
            </Animated.View>
            {showButtons && (
              <Animated.View 
                entering={FadeIn.duration(200).easing(Easing.out(Easing.ease))}
                style={styles.actionContainer}
              >
                <ActionButton 
                  label="Dislike" 
                  variant="dislike" 
                  showIcon={true}
                  onPress={() => console.log('Dislike')}
                />
                <ActionButton 
                  label="Share" 
                  variant="share" 
                  showIcon={true}
                  onPress={() => console.log('Share')} 
                />
                <ActionButton 
                  label="Like" 
                  variant="like" 
                  showIcon={true}
                  onPress={() => console.log('Like')}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  mainContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 30,
    padding: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  mainContainerWithButtons: {
    paddingTop: 50,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 