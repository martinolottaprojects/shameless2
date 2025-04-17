import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { ActionButton } from '@/components/ActionButton';
import Colors from '@/constants/Colors';
import { LogoIcon } from '@/components/LogoIcon';
import { Scratch } from '@/components/Scratch';
import type { Position } from '@/types/position';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { usePositionInteraction } from '@/hooks/usePositionInteraction';
import Animated, { 
  withSpring, 
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

export default function Index() {
  const [showButtons, setShowButtons] = useState(false);
  const [hasInitialLayout, setHasInitialLayout] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const { likePosition, dislikePosition, loading: interactionLoading } = usePositionInteraction();

  useEffect(() => {
    fetchRandomPosition();
  }, []);

  const fetchRandomPosition = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setCurrentPosition(data);
    } catch (error) {
      console.error('Error fetching position:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (type: 'like' | 'dislike') => {
    if (!currentPosition || interactionLoading) return;

    try {
      if (type === 'like') {
        await likePosition(currentPosition.id);
      } else {
        await dislikePosition(currentPosition.id);
      }
      
      // Reset UI state and fetch next position
      setShowButtons(false);
      setHasInitialLayout(false);
      fetchRandomPosition();
    } catch (error) {
      console.error('Error interacting with position:', error);
      // You might want to show an error message to the user here
    }
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!currentPosition) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>No positions available</Text>
      </View>
    );
  }

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
                position={currentPosition}
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
                  onPress={() => handleInteraction('dislike')}
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
                  onPress={() => handleInteraction('like')}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
