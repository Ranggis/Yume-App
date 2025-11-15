import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    Array.from({ length: 8 }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animasi rotasi loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animasi scaling titik (muncul satu per satu)
    const animations = scaleAnims.map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 150), // jeda antar titik
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 600,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ),
      ])
    );

    Animated.stagger(120, animations).start();

    // Navigasi ke StartScreen setelah 3.5 detik
    const timer = setTimeout(() => {
      navigation.navigate('StartScreen' as never);
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Interpolasi rotasi
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Bikin 8 titik dalam lingkaran
  const dots = Array.from({ length: 8 });

  return (
    <View style={styles.container}>
      {/* Logo Yume */}
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Spiral loader */}
      <Animated.View style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}>
        {dots.map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180; // 8 titik tiap 45°
          const radius = 30;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  top: y + radius,
                  left: x + radius,
                  transform: [{ scale: scaleAnims[i] }],
                  opacity: scaleAnims[i],
                },
              ]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 85,
  },
  loaderContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00E676',
  },
});
