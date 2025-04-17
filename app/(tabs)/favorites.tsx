import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useLikedPositions } from '@/hooks/useLikedPositions';
import { Position } from '@/types/position';
import PositionCard from '../../components/PositionCard';

export default function Favorites() {
  const { likedPositions, loading } = useLikedPositions();

  // Remove any duplicate positions based on ID
  const uniquePositions = Array.from(new Map(
    likedPositions.map(position => [position.id, position])
  ).values());

  const renderItem = ({ item }: { item: Position }) => (
    <PositionCard position={item} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No liked positions yet</Text>
      <Text style={styles.emptySubtext}>
        Positions you like will appear here
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favorites',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.secondary,
          },
          headerTintColor: Colors.tertiary,
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={uniquePositions}
            renderItem={renderItem}
            keyExtractor={(item) => `position-${item.id}`}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.tertiary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.tertiary,
    textAlign: 'center',
  },
}); 