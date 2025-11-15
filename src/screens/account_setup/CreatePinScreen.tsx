import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack'; // pastikan path benar
import { Header } from '@react-navigation/stack';

const CreatePinScreen = ({ navigation }: any) => {
  const [pin, setPin] = useState<string[]>([]);
  const [showNumbers, setShowNumbers] = useState<boolean[]>([false, false, false, false]);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = [...pin, num];
      setPin(newPin);

      // tampilkan angka sebentar sebelum jadi dot
      const newShowNumbers = [...showNumbers];
      newShowNumbers[newPin.length - 1] = true;
      setShowNumbers(newShowNumbers);

      setTimeout(() => {
        const updatedShowNumbers = [...newShowNumbers];
        updatedShowNumbers[newPin.length - 1] = false;
        setShowNumbers(updatedShowNumbers);
      }, 300);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setShowNumbers(showNumbers.map((_, i) => (i < pin.length - 1 ? showNumbers[i] : false)));
  };

  const handleContinue = () => {
    if (pin.length === 4) {
      console.log('PIN created:', pin.join(''));
      navigation.navigate('SetFingerprintScreen');
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2, 3].map((index) => {
        const value = pin[index];
        const showNumber = showNumbers[index];
        const scale = new Animated.Value(value ? 1.1 : 1);

        Animated.spring(scale, {
          toValue: value ? 1 : 1,
          useNativeDriver: true,
        }).start();

        return (
          <Animated.View
            key={`dot-${index}`}
            style={[
              styles.dot,
              value && styles.dotActive,
              { transform: [{ scale }] },
            ]}
          >
            {value && <Text style={styles.dotText}>{showNumber ? value : '•'}</Text>}
          </Animated.View>
        );
      })}
    </View>
  );

  const renderKey = (num: string) => (
    <TouchableOpacity key={num} style={styles.key} onPress={() => handlePress(num)}>
      <Text style={styles.keyText}>{num}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <HeaderBack title="Create New PIN" onBack={() => navigation.goBack()} />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Add a PIN number to make your account more secure.
      </Text>

      {/* PIN Dots */}
      {renderDots()}

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, { opacity: pin.length === 4 ? 1 : 0.5 }]}
        disabled={pin.length !== 4}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Keypad */}
      <View style={styles.keypad}>
        <View style={styles.row}>
          {['1', '2', '3'].map((num) => renderKey(num))}
        </View>
        <View style={styles.row}>
          {['4', '5', '6'].map((num) => renderKey(num))}
        </View>
        <View style={styles.row}>
          {['7', '8', '9'].map((num) => renderKey(num))}
        </View>

        {/* Baris terakhir: titik, nol, hapus */}
        <View style={styles.row}>
          <TouchableOpacity key="dot" style={[styles.key, { opacity: 0.3 }]} disabled>
            <Text style={styles.keyText}>.</Text>
          </TouchableOpacity>

          {renderKey('0')}

          <TouchableOpacity key="delete" style={styles.key} onPress={handleDelete}>
            <Ionicons name="backspace-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreatePinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 40,
    lineHeight: 20,
    textAlign: 'justify', // biar teks rata kanan-kiri
    alignSelf: 'center', // biar blok teks-nya tetap di tengah layar
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 50,
    marginBottom: 40,
  },
  dot: {
    width: 55,
    height: 55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dotActive: {
    borderColor: '#00E676',
  },
  dotText: {
    color: '#00E676',
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#00E676',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 30,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  keypad: {
    marginTop: 0,
    paddingBottom: 20, // tambah dikit biar gak nempel ke ujung layar
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
  },
});
