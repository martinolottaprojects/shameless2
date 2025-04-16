import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function DevTools() {
  const { isOnboarded, setIsOnboarded } = useOnboarding();
  const { signOut, session } = useAuth();

  const handleResetOnboarding = () => {
    setIsOnboarded(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResetAll = async () => {
    try {
      setIsOnboarded(false);
      await signOut();
    } catch (error) {
      console.error('Error resetting app:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "DevTools",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '600',
            color: Colors.tertiary,
          },
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

          <View style={[styles.section, styles.sectionSpacing]}>
            <ThemedText style={styles.sectionTitle}>Authentication</ThemedText>
            <View style={styles.card}>
              <View style={styles.statusRow}>
                <ThemedText style={styles.label}>Status:</ThemedText>
                <View style={[styles.statusBadge, styles.statusCompleted]}>
                  <MaterialCommunityIcons 
                    name="shield-check" 
                    size={16} 
                    color="#057A55" 
                  />
                  <ThemedText style={[styles.statusText, styles.statusTextCompleted]}>
                    Authenticated
                  </ThemedText>
                </View>
              </View>

              <View style={styles.statusRow}>
                <ThemedText style={styles.label}>User Email:</ThemedText>
                <ThemedText style={styles.emailText}>
                  {session?.user?.email || 'N/A'}
                </ThemedText>
              </View>

              <TouchableOpacity 
                style={[styles.button, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <MaterialCommunityIcons name="logout" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Logout</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, styles.sectionSpacing]}>
            <ThemedText style={styles.sectionTitle}>Reset App</ThemedText>
            <View style={styles.card}>
              <ThemedText style={styles.warningText}>
                This will reset onboarding and log you out of the app.
              </ThemedText>
              <TouchableOpacity 
                style={[styles.button, styles.resetAllButton]} 
                onPress={handleResetAll}
              >
                <MaterialCommunityIcons name="refresh-circle" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Reset All</ThemedText>
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
  section: {
    gap: 12,
  },
  sectionSpacing: {
    marginTop: 24,
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
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.tertiary,
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
  logoutButton: {
    backgroundColor: '#DC2626',
  },
  resetAllButton: {
    backgroundColor: '#991B1B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
  },
}); 