import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { LogoIcon } from '@/components/LogoIcon';

export default function Favorites() {
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
  text: {
    fontSize: 18,
    color: Colors.tertiary,
  },
}); 