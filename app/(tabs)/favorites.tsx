import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function Favorites() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Favorites",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '600',
            color: Colors.tertiary,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Favorites Coming Soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.tertiary,
  },
}); 