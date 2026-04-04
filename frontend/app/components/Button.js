import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const styles = getStyles(variant, size);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#667eea'} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (variant, size) => {
  const baseStyle = {
    button: {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    text: {
      fontWeight: '600',
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
  };

  const variantStyles = {
    primary: {
      button: { backgroundColor: '#667eea' },
      text: { color: '#fff' },
    },
    secondary: {
      button: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#667eea' },
      text: { color: '#667eea' },
    },
    success: {
      button: { backgroundColor: '#4caf50' },
      text: { color: '#fff' },
    },
    danger: {
      button: { backgroundColor: '#f44336' },
      text: { color: '#fff' },
    },
  };

  const sizeStyles = {
    small: {
      button: { paddingVertical: 8, paddingHorizontal: 12 },
      text: { fontSize: 14 },
    },
    medium: {
      button: { paddingVertical: 12, paddingHorizontal: 20 },
      text: { fontSize: 16 },
    },
    large: {
      button: { paddingVertical: 16, paddingHorizontal: 24 },
      text: { fontSize: 18 },
    },
  };

  return {
    button: { ...baseStyle.button, ...variantStyles[variant]?.button, ...sizeStyles[size]?.button },
    text: { ...baseStyle.text, ...variantStyles[variant]?.text, ...sizeStyles[size]?.text },
    disabled: baseStyle.disabled,
  };
};

export default Button;
