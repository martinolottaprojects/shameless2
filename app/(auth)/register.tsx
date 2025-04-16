import { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AuthButton } from '../../components/AuthButton';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    try {
      setError(null);
      await signUp(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.main}>
            <ThemedText style={styles.title}>Create Account</ThemedText>
            
            {error && (
              <ThemedText style={styles.error}>{error}</ThemedText>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText>Email</ThemedText>
                <ThemedView style={styles.input}>
                  <TextInput
                    style={styles.inputText}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#666"
                  />
                </ThemedView>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText>Password</ThemedText>
                <ThemedView style={styles.input}>
                  <TextInput
                    style={styles.inputText}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    secureTextEntry
                    placeholderTextColor="#666"
                  />
                </ThemedView>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <AuthButton
              label="Sign Up"
              onPress={handleRegister}
              style={styles.button}
            />

            <ThemedText
              style={styles.link}
              onPress={() => router.push('/login')}
            >
              Already have an account? Sign in
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 24,
  },
  title: {
    fontSize: 52,
    fontFamily: 'System',
    fontWeight: '900',
    textAlign: 'left',
    letterSpacing: -2.5,
    lineHeight: 56,
    color: '#000',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderRadius: 60,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  inputText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
  },
  footer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
}); 