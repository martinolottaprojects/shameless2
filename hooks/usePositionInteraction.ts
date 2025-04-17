import { useState } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';

type InteractionType = 'like' | 'dislike';

export function usePositionInteraction() {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const interactWithPosition = async (positionId: string, type: InteractionType) => {
    if (!session?.user) {
      throw new Error('User must be authenticated to interact with positions');
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('position_interactions')
        .insert({
          user_id: session.user.id,
          position_id: positionId,
          interaction_type: type
        });

      if (error) throw error;

    } catch (error) {
      console.error(`Error ${type}ing position:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const likePosition = (positionId: string) => interactWithPosition(positionId, 'like');
  const dislikePosition = (positionId: string) => interactWithPosition(positionId, 'dislike');

  return {
    likePosition,
    dislikePosition,
    loading
  };
} 