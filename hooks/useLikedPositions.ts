import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Position } from '@/types/position';

type DatabasePosition = {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

type PositionInteractionResponse = {
  position: DatabasePosition;
}

export function useLikedPositions() {
  const [likedPositions, setLikedPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  // Fetch initial liked positions
  const fetchLikedPositions = async () => {
    if (!session?.user) return;
    
    try {
      // Get the most recent interaction for each position
      const { data, error } = await supabase
        .from('position_interactions')
        .select(`
          position:positions (
            id,
            name,
            image_url,
            created_at
          )
        `)
        .eq('user_id', session.user.id)
        .eq('interaction_type', 'like')
        // Order by created_at desc and get distinct on position_id to get only the latest interaction
        .order('created_at', { ascending: false })
        .returns<PositionInteractionResponse[]>();

      if (error) throw error;

      // Transform the data to get just the position objects and remove any nulls
      const positions = data
        .map(item => item.position)
        .filter((position): position is DatabasePosition => position !== null)
        .map(position => ({
          id: position.id,
          title: position.name,
          company: '',  // These fields might not exist in the database
          location: '', // but are required by our Position type
          type: '',
          description: '',
          requirements: [],
          responsibilities: [],
          postedAt: position.created_at,
          image_url: position.image_url
        }));
      
      setLikedPositions(positions);
    } catch (error) {
      console.error('Error fetching liked positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const removePosition = async (positionId: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('position_interactions')
        .delete()
        .eq('user_id', session.user.id)
        .eq('position_id', positionId)
        .eq('interaction_type', 'like');

      if (error) throw error;

      // Optimistically update the UI
      setLikedPositions(prev => prev.filter(pos => pos.id !== positionId));
    } catch (error) {
      console.error('Error removing position:', error);
    }
  };

  useEffect(() => {
    if (!session?.user) return;

    fetchLikedPositions();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('position_interactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'position_interactions',
          filter: `user_id=eq.${session.user.id}`,
        },
        async () => {
          // Refresh the liked positions when there's a change
          await fetchLikedPositions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [session?.user]);

  return {
    likedPositions,
    loading,
    removePosition
  };
} 