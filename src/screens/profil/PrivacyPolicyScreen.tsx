import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      {/* Header */}
        <View style={styles.headerWrapper}>
          <HeaderBack
            title="Privacy Policy"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Types of Data We Collect</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Your Personal Data</Text>
        <Text style={styles.text}>
          Magna etiam tempor orci eu lobortis elementum nibh. Vulputate enim nulla aliquet porttitor lacus. 
          Orci sagittis eu volutpat odio. Cras semper auctor neque vitae tempus quam pellentesque nec. 
          Non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor. 
          Nisi vitae suscipit tellus mauris a diam. Erat pellentesque adipiscing commodo elit at imperdiet dui.
        </Text>

        <Text style={styles.sectionTitle}>3. Disclosure of Your Personal Data</Text>
        <Text style={styles.text}>
          Consequat id porta nibh venenatis cras sed. Ipsum nunc aliquet bibendum enim facilisis gravida neque. 
          Pulvinar pellentesque habitant morbi tristique senectus et netus. 
          Massa tempor nec feugiat nisl pretium fusce id velit ut tortor pretium viverra. 
          Nunc consequat interdum varius sit amet mattis vulputate enim nulla aliquet.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Retention</Text>
        <Text style={styles.text}>
          We retain your data only as long as necessary to provide our services or comply with legal obligations. 
          You can request deletion of your data at any time by contacting support.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at:
          {'\n\n'}support@animestreamapp.com
        </Text>

        <Text style={styles.lastUpdated}>Last Updated: October 2025</Text>
      </ScrollView>
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
  sectionTitle: {
    color: '#00C853',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
  },
  lastUpdated: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 30,
  },
});

export default PrivacyPolicyScreen;
