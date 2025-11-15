import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import HeaderBack from '../components/HeaderBack';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import { useNavigation } from '@react-navigation/native';

const ReviewSummaryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [successVisible, setSuccessVisible] = useState(false);

  const plan = {
    title: 'Premium Plan',
    price: 9.99,
    tax: 1.99,
  };

  const total = plan.price + plan.tax;

  return (
    <View style={styles.container}>
      {/* Header pakai komponen global */}
      <HeaderBack
        title="Review Summary"
        onBack={() => navigation.goBack()}
        rightIcon="scan-outline"
        onRightPress={() => console.log('Scan pressed')}
      />

      {/* Plan Summary */}
      <View style={styles.planCard}>
        <View style={styles.planTop}>
          <IconFA name="crown" size={30} color="#00C853" />
          <Text style={styles.priceText}>
            ${plan.price.toFixed(2)}
            <Text style={styles.per}>/month</Text>
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.benefitRow}>
          <Icon name="checkmark-circle" size={18} color="#00C853" />
          <Text style={styles.benefitText}>Watch all you want. Ad-free.</Text>
        </View>
        <View style={styles.benefitRow}>
          <Icon name="checkmark-circle" size={18} color="#00C853" />
          <Text style={styles.benefitText}>Allows streaming of 4K.</Text>
        </View>
        <View style={styles.benefitRow}>
          <Icon name="checkmark-circle" size={18} color="#00C853" />
          <Text style={styles.benefitText}>Video & Audio Quality is Better.</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>${plan.price.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>${plan.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentMethod}>
        <View style={styles.methodRow}>
          <Image
            source={require('../../../assets/MasterCard.png')}
            style={styles.cardIcon}
          />
          <Text style={styles.methodText}>**** **** **** 4679</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('PaymentScreen')}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Payment Button */}
      <TouchableOpacity
        style={styles.confirmBtn}
        activeOpacity={0.9}
        onPress={() => setSuccessVisible(true)}>
        <Text style={styles.confirmText}>Confirm Payment</Text>
      </TouchableOpacity>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        onConfirm={() => {
          setSuccessVisible(false);
          navigation.navigate('MainTabs');
        }}
      />
    </View>
  );
};

export default ReviewSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  planCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
  per: {
    color: '#aaa',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1E1E',
    marginVertical: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  benefitText: {
    color: '#ccc',
    marginLeft: 8,
    fontSize: 14,
  },
  detailCard: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  totalLabel: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 35,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  methodText: {
    color: '#fff',
    fontSize: 15,
  },
  changeText: {
    color: '#00C853',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
