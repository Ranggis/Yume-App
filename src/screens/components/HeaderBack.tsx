import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderBackProps {
  title: string;
  onBack: () => void;
  color?: string; // default putih
  rightIcon?: string; // ikon opsional di kanan (misalnya "scan-outline")
  onRightPress?: () => void; // aksi saat ditekan
}

const HeaderBack: React.FC<HeaderBackProps> = ({
  title,
  onBack,
  color = '#fff',
  rightIcon,
  onRightPress,
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        {/* Tombol Back */}
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.title, { color }]}>{title}</Text>

        {/* Right Icon (opsional) */}
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <Ionicons name={rightIcon} size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} /> // biar simetris kalau gak ada icon
        )}
      </View>
    </SafeAreaView>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  safeArea: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // tambahkan biar icon kanan di posisi kanan
    marginTop: 0,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  rightButton: {
    padding: 8,
  },
});
