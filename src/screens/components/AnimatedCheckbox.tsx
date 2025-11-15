import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AnimatedCheckboxProps {
  label?: string;
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  label = 'Remember me',
  initialValue = false,
  onToggle,
  containerStyle,
  labelStyle,
}) => {
  const [checked, setChecked] = useState(initialValue);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // animasi kecil biar hidup
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    const newValue = !checked;
    setChecked(newValue);
    onToggle?.(newValue);
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#000" />}
      </Animated.View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AnimatedCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#00E676',
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    color: '#ccc',
    fontSize: 15,
  },
});
