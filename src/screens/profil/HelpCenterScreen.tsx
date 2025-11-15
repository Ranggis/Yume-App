import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');

  const categories = ['General', 'Account', 'Service', 'Video'];

  const faqs = [
    { id: '1', question: 'What is Yume?', answer: 'Yume is an anime streaming platform...' },
    { id: '2', question: 'How to remove anime on wishlist?', answer: 'Open your wishlist and tap the remove icon.' },
    { id: '3', question: 'How do I subscribe to premium?', answer: 'Go to Profile → Join Premium → Choose plan → Confirm payment.' },
    { id: '4', question: 'How do I download anime?', answer: 'Click the Download button on an anime’s detail page.' },
    { id: '5', question: 'How to unsubscribe from premium?', answer: 'Go to Profile → Subscription → Cancel subscription.' },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Help Center"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'faq' && styles.activeTabText,
            ]}
          >
            FAQ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'contact' && styles.activeTabText,
            ]}
          >
            Contact us
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'faq' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.categoryRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.categoryActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color="#888" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#666"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
            <Icon name="filter-outline" size={20} color="#00C853" />
          </View>

          {/* FAQ List */}
          {filteredFaqs.map(faq => (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() =>
                  setExpanded(expanded === faq.id ? null : faq.id)
                }
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={
                    expanded === faq.id
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={18}
                  color="#00C853"
                />
              </TouchableOpacity>

              {expanded === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Contact Section */}
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>Customer Service</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>WhatsApp</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>Website</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>Facebook</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>Twitter</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>Instagram</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  headerWrapper: {
  paddingHorizontal: 0, 
  marginLeft: -10, 
  marginBottom: 10, 
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#222',
  },
  activeTab: {
    borderBottomColor: '#00C853',
  },
  tabText: {
    color: '#888',
    fontSize: 15,
  },
  activeTabText: {
    color: '#00C853',
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#00C85355',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryActive: {
    backgroundColor: '#00C853',
  },
  categoryText: {
    color: '#00C853',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  faqCard: {
    backgroundColor: '#151515',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  faqAnswer: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  contactCard: {
    backgroundColor: '#151515',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
  },
  contactItem: {
    color: '#00C853',
    fontSize: 15,
  },
});

export default HelpCenterScreen;
