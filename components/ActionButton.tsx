import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'like' | 'dislike' | 'share';
  showIcon?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  variant = 'like',
  showIcon = false,
}) => {
  const renderContent = () => {
    if (showIcon) {
      switch (variant) {
        case 'share':
          return <Feather name="send" size={24} color="#000000" />;
        case 'like':
          return <Feather name="heart" size={24} color="#000000" />;
        case 'dislike':
          return <Feather name="x" size={24} color="#000000" />;
        default:
          return (
            <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
              {label}
            </Text>
          );
      }
    }
    return (
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
        {label}
      </Text>
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        styles[variant],
      ]} 
      onPress={onPress}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  like: {
    backgroundColor: Colors.quaternary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  dislike: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  share: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  likeText: {
    color: '#000000',
  },
  dislikeText: {
    color: '#000000',
  },
  shareText: {
    color: '#000000',
  },
}); 