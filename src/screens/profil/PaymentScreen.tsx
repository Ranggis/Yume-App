import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBack from '../components/HeaderBack';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedMethod, setSelectedMethod] = useState('PayPal');

  const paymentMethods = [
    {
      id: 'PayPal',
      label: 'PayPal',
      icon: require('../../../assets/Paypal.png'),
    },
    {
      id: 'GooglePay',
      label: 'Google Pay',
      icon: require('../../../assets/Google.png'),
    },
    {
      id: 'ApplePay',
      label: 'Apple Pay',
      icon: require('../../../assets/Apple.png'),
    },
      {
      id: 'Credit Card',
      label: 'Credit Card',
      icon: require('../../../assets/MasterCard.png'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Global */}
      <HeaderBack title="Payment" 
      onBack={() => navigation.goBack()}   
      rightIcon="scan-outline"
      onRightPress={() => console.log('Scan tapped!')} />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Select the payment method you want to use.
      </Text>

      {/* Payment Methods */}
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.selectedCard,
          ]}
          onPress={() => setSelectedMethod(method.id)}
          activeOpacity={0.8}
        >
          <View style={styles.row}>
            <Image source={method.icon} style={styles.icon} />
            <Text style={styles.methodLabel}>{method.label}</Text>
          </View>

          {/* Radio */}
          <View
            style={[
              styles.radioOuter,
              selectedMethod === method.id && styles.radioOuterActive,
            ]}
          >
            {selectedMethod === method.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Add New Card Button */}
      <TouchableOpacity
        style={styles.addCardBtn}
        onPress={() => navigation.navigate('AddCardScreen')}
        activeOpacity={0.9}
      >
        <Text style={styles.addCardText}>Add New Card</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() =>
          navigation.navigate('ReviewSummaryScreen', { method: selectedMethod })
        }
        activeOpacity={0.9}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 25,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  selectedCard: {
    borderColor: '#00C853',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  methodLabel: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#00C853',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C853',
  },
  addCardBtn: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  addCardText: {
    color: '#fff',
    fontSize: 15,
  },
  continueBtn: {
    marginTop: 85,
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 35,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
