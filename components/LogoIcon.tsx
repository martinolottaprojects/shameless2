import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const LogoIcon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>S</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.tertiary,
  },
  text: {
    color: Colors.tertiary,
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 