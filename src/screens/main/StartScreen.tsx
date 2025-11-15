import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Yume',
    subtitle: 'The best streaming anime app to entertain you every day.',
    image: require('../../../assets/background.png'),
  },
  {
    id: '2',
    title: 'Explore Endless Worlds',
    subtitle: 'Dive into adventures every day — from fantasy to romance.',
    image: require('../../../assets/background.png'),
  },
  {
    id: '3',
    title: 'Stream Without Limits',
    subtitle: 'Watch your favorite anime anytime, anywhere — ad-free.',
    image: require('../../../assets/background.png'),
  },
];

const StartScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleGetStarted = () => {
    navigation.navigate('StartedLogin' as never);
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <Animated.Image
          source={item.image}
          style={[styles.image]}
          resizeMode="cover"
        />
        <View style={styles.overlay} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const DotIndicator = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      <DotIndicator />
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: 340,
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#00E676',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  pagination: {
    position: 'absolute',
    bottom: height * 0.18,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#00E676',
    marginHorizontal: 6,
  },
});
