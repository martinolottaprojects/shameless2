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
import { useAuth } from '@/contexts/AuthContext';
import Animated, { 
  withSpring, 
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import PositionCard from '@/components/PositionCard';

// Database types
interface DatabasePosition {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

// Type adapter function
const adaptDatabasePosition = (dbPosition: DatabasePosition): Position => ({
  id: dbPosition.id,
  title: dbPosition.name,
  company: '',
  location: '',
  type: '',
  description: '',
  requirements: [],
  responsibilities: [],
  postedAt: dbPosition.created_at,
  image_url: dbPosition.image_url
});

export default function Index() {
  const [showButtons, setShowButtons] = useState(false);
  const [hasInitialLayout, setHasInitialLayout] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [noPositionsAvailable, setNoPositionsAvailable] = useState(false);
  const { likePosition, dislikePosition, loading: interactionLoading } = usePositionInteraction();
  const { session } = useAuth();

  useEffect(() => {
    fetchRandomPosition();
  }, []);

  const fetchRandomPosition = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      
      // First, get all position IDs that the user has already interacted with
      const { data: interactedPositions, error: interactionError } = await supabase
        .from('position_interactions')
        .select('position_id')
        .eq('user_id', session.user.id);

      if (interactionError) throw interactionError;

      // Get the array of position IDs to exclude
      const excludeIds = interactedPositions?.map(p => p.position_id) || [];

      // Fetch a random position that hasn't been interacted with
      let query = supabase
        .from('positions')
        .select('*')
        .limit(1);
      
      // Only add the not-in condition if there are positions to exclude
      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.message.includes('PGRST116')) {
          setNoPositionsAvailable(true);
          const dummyPosition: Position = {
            id: 'dummy',
            title: 'No More Positions',
            company: 'N/A',
            location: 'N/A',
            type: 'N/A',
            description: 'You have interacted with all available positions.',
            requirements: [],
            responsibilities: [],
            postedAt: new Date().toISOString(),
            image_url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2500&auto=format&fit=crop'
          };
          setCurrentPosition(dummyPosition);
        } else {
          console.error('Error fetching position:', error);
        }
      } else {
        setNoPositionsAvailable(false);
        setCurrentPosition(adaptDatabasePosition(data));
      }
    } catch (error) {
      console.error('Error fetching position:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (type: 'like' | 'dislike') => {
    if (!currentPosition || interactionLoading || noPositionsAvailable) return;

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <Animated.View 
            style={styles.contentContainer}
            entering={FadeIn.duration(300).easing(Easing.out(Easing.ease))}
          >
            <View style={[
              styles.mainContainer,
              (showButtons || hasInitialLayout) && styles.mainContainerWithButtons
            ]}>
              <Animated.View style={[
                styles.cardWrapper,
                hasInitialLayout && animatedStyle
              ]}>
                {currentPosition && (
                  <Scratch
                    position={currentPosition}
                    onScratchComplete={handleScratchComplete}
                    disabled={noPositionsAvailable}
                    onLike={() => handleInteraction('like')}
                    onDislike={() => handleInteraction('dislike')}
                  />
                )}
              </Animated.View>
              {showButtons && !noPositionsAvailable && (
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
          </Animated.View>
        )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
