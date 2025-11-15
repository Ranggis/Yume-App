import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HeaderBack from '../components/HeaderBack';

const AddCardScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [cardName, setCardName] = useState('M Ranggis Refaldi');
  const [cardNumber, setCardNumber] = useState('2672 4738 7837 7285');
  const [expiryDate, setExpiryDate] = useState('09/07/26');
  const [cvv, setCvv] = useState('699');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header dari Komponen */}
      <HeaderBack
        title="Add New Card"
        onBack={() => navigation.goBack()}
        rightIcon="scan-outline"
        onRightPress={() => console.log('Scan pressed!')}
      />

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        <View style={styles.cardTop}>
          <Text style={styles.cardBrand}>Mocard</Text>
          <Text style={styles.cardCompany}>amazon</Text>
        </View>
        <View style={styles.cardMiddle}>
          <Text style={styles.cardDots}>•••• •••• •••• ••••</Text>
        </View>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.cardLabel}>Card Holder name</Text>
            <Text style={styles.cardValue}>•••• ••••</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expiry date</Text>
            <Text style={styles.cardValue}>••/••</Text>
          </View>
        </View>
      </View>

      {/* Input Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Card Name</Text>
        <TextInput
          style={styles.input}
          value={cardName}
          onChangeText={setCardName}
          placeholder="Enter card name"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          placeholder="XXXX XXXX XXXX XXXX"
          placeholderTextColor="#666"
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputText}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/YY"
                placeholderTextColor="#666"
              />
              <Icon name="calendar-outline" size={20} color="#999" />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="CVV"
              placeholderTextColor="#666"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PaymentScreen')}
        activeOpacity={0.9}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  cardPreview: {
    backgroundColor: '#00C853',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBrand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cardCompany: {
    color: '#fff',
    fontSize: 14,
  },
  cardMiddle: {
    alignItems: 'center',
    marginVertical: 30,
  },
  cardDots: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 3,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
  },
  cardValue: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 3,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
    inputWrapper: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  inputText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 12,
  },
  iconRight: {
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
