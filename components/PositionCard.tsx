import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Position } from '../types/position';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

type Props = {
  position: Position;
  isClickable?: boolean;
  onRemove?: () => void;
};

export default function PositionCard({ position, isClickable = true, onRemove }: Props) {
  const imageUrl = position.image_url || 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2500&auto=format&fit=crop';

  const CardContent = () => (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {onRemove && (
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{position.title}</Text>
      </View>
    </View>
  );

  if (!isClickable) {
    return <CardContent />;
  }

  return (
    <Link href={`/position/${position.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <CardContent />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  titleContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
}); 