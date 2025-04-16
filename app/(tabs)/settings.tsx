import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { LogoIcon } from '@/components/LogoIcon';
import { ThemedText } from '@/components/ThemedText';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DevTools() {
  const { isOnboarded, setIsOnboarded } = useOnboarding();

  const handleResetOnboarding = () => {
    setIsOnboarded(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <View style={styles.logoContainer}>
              <LogoIcon />
              <ThemedText style={styles.logoText}>DevTools</ThemedText>
            </View>
          ),
          headerRight: () => null,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Onboarding</ThemedText>
            <View style={styles.card}>
              <View style={styles.statusRow}>
                <ThemedText style={styles.label}>Status:</ThemedText>
                <View style={[styles.statusBadge, isOnboarded ? styles.statusCompleted : styles.statusPending]}>
                  <MaterialCommunityIcons 
                    name={isOnboarded ? "check-circle" : "clock-outline"} 
                    size={16} 
                    color={isOnboarded ? "#057A55" : "#D97706"} 
                  />
                  <ThemedText style={[
                    styles.statusText,
                    isOnboarded ? styles.statusTextCompleted : styles.statusTextPending
                  ]}>
                    {isOnboarded ? "Completed" : "Not Completed"}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleResetOnboarding}
              >
                <MaterialCommunityIcons name="restart" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Reset Onboarding</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.tertiary,
  },
  card: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#057A55',
  },
  statusTextPending: {
    color: '#D97706',
  },
  button: {
    backgroundColor: '#0A7EA4',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
}); 