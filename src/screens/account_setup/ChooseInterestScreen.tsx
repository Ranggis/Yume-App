import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack'; // panggil header

const INTERESTS = [
  'Action', 'Drama', 'Comedy', 'Ecchi', 'Adventure', 'Mecha',
  'Romance', 'Science', 'Music', 'School', 'Seinen', 'Shoujo',
  'Fantasy', 'Mystery', 'Vampire', 'Isekai', 'Shounen',
  'Television', 'Superheroes', 'Magic', 'Game', 'Slice of Life',
];

const ChooseInterestScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header pakai komponen biar konsisten */}
      <View style={styles.headerWrapper}>
        <HeaderBack title="Choose Your Interest" onBack={() => navigation.goBack()} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Choose your interests and get the best anime recommendations.{"\n"}
        Don’t worry, you can always change it later.
      </Text>

      {/* Interests (scrollable) */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tagsContainer}>
          {INTERESTS.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleInterest(item)}
              >
                <Text
                  style={[styles.tagText, isSelected && styles.tagTextSelected]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('FillProfileScreen')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('FillProfileScreen')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseInterestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  subtitle: {
    color: '#999',
    fontSize: 17,
    marginBottom: 30,
    lineHeight: 20,
    marginTop:-10,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  tag: {
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginRight: 10,
    marginBottom: 12,
    backgroundColor: '#000',
  },
  tagSelected: {
    backgroundColor: '#00E676',
  },
  tagText: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#000',
    fontWeight: '700',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  skipButton: {
    backgroundColor: '#222',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  continueButton: {
    backgroundColor: '#00E676',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#00E676',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  skipText: {
    color: '#ccc',
    fontWeight: '600',
    fontSize: 15,
  },
  continueText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});
