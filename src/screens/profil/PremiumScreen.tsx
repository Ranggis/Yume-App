import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import HeaderBack from '../components/HeaderBack';

const PremiumScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const plans = [
    {
      id: 'monthly',
      price: '$9.99',
      duration: '/month',
      features: [
        'Watch all you want. Ad-free.',
        'Allows streaming of 4K.',
        'Video & Audio Quality is Better.',
      ],
    },
    {
      id: 'yearly',
      price: '$99.99',
      duration: '/year',
      features: [
        'Watch all you want. Ad-free.',
        'Allows streaming of 4K.',
        'Video & Audio Quality is Better.',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('PaymentScreen'); // ganti sesuai nama screen kamu nanti
  };

  return (
    <View style={styles.container}>
      {/* Header Back */}
      <HeaderBack title="" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title & Description */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Subscribe to Premium</Text>
          <Text style={styles.description}>
            Enjoy watching Full-HD animes, without restrictions and without ads
          </Text>
        </View>

        {/* Plans */}
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => handleSelectPlan(plan.id)}
          >
            <View style={styles.iconWrapper}>
            <IconFA name="crown" size={42} color="#00C853" />
            </View>

            <Text style={styles.priceText}>
              {plan.price}
              <Text style={styles.durationText}> {plan.duration}</Text>
            </Text>

            <View style={styles.divider} />

            {plan.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Icon name="checkmark-outline" size={18} color="#00C853" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Konfirmasi */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            <Text style={styles.modalText}>
              {selectedPlan === 'monthly'
                ? 'You selected $9.99/month plan.'
                : 'You selected $99.99/year plan.'}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#00C853' }]}
                onPress={handleConfirm}
              >
                <Text style={styles.modalBtnText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#333' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PremiumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 25,
  },
  mainTitle: {
    color: '#00C853',
    fontSize: 38,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#00C853',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#101010',
  },
  planCardSelected: {
    backgroundColor: '#0f1f14',
    borderColor: '#00e676',
    shadowColor: '#00C853',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconWrapper: {
    marginBottom: 10,
  },
  priceText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  durationText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#1f1f1f',
    marginVertical: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  featureText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#00C853',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalText: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
