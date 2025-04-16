import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'SF Pro',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '900',
    lineHeight: 29,
    letterSpacing: -0.48,
  },
}); 