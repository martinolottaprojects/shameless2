import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Position } from '../types/position';

type Props = {
  position: Position;
  isClickable?: boolean;
};

export default function PositionCard({ position, isClickable = true }: Props) {
  const imageUrl = position.image_url || 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2500&auto=format&fit=crop';

  const CardContent = () => (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
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
}); 