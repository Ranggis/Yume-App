import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit(selectedRating);
    onClose();
  };

  const ratingData = [
    { stars: 5, value: 90 },
    { stars: 4, value: 7 },
    { stars: 3, value: 2 },
    { stars: 2, value: 1 },
    { stars: 1, value: 0.5 },
  ];

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] },
        ]}>
        <Text style={styles.title}>Give Rating</Text>

        {/* Rating Summary */}
        <View style={styles.summaryContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.score}>9.8<Text style={styles.outOf}> /10</Text></Text>
            <View style={styles.starRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={18}
                  color={i < 5 ? '#00C853' : '#444'}
                />
              ))}
            </View>
            <Text style={styles.userCount}>(69,575 users)</Text>
          </View>

          <View style={{ flex: 2, paddingLeft: 10 }}>
            {ratingData.map((item) => (
              <View key={item.stars} style={styles.ratingBarRow}>
                <Text style={styles.barLabel}>{item.stars}</Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${item.value}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* User Rating */}
        <View style={styles.userRateContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRating(index + 1)}>
              <Icon
                name={index < selectedRating ? 'star' : 'star-outline'}
                size={36}
                color={index < selectedRating ? '#00C853' : '#555'}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            disabled={selectedRating === 0}
            onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#111',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  score: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  outOf: { color: '#aaa', fontSize: 16 },
  starRow: { flexDirection: 'row', marginVertical: 5 },
  userCount: { color: '#777', fontSize: 12 },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  barLabel: { color: '#999', width: 15, fontSize: 12 },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 5,
    marginLeft: 6,
  },
  barFill: {
    height: 6,
    backgroundColor: '#00C853',
    borderRadius: 5,
  },
  userRateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#222',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  submitButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 35,
    opacity: 1,
  },
  cancelText: { color: '#fff', fontWeight: '600' },
  submitText: { color: '#fff', fontWeight: '600' },
});

export default RatingModal;
