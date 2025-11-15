import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Image,
  Easing,
} from 'react-native';

const SetupCompleteModal = ({
  visible,
  onFinish,
}: {
  visible: boolean;
  onFinish: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    Array.from({ length: 8 }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      // Animasi modal muncul (fade + scale)
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Animasi spiral dots berputar
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Animasi tiap titik muncul dan berdenyut
      const animations = scaleAnims.map((anim, i) =>
        Animated.sequence([
          Animated.delay(i * 150),
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

      // Otomatis tutup modal & pindah halaman setelah 3 detik
      const timer = setTimeout(() => {
        onFinish();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dots = Array.from({ length: 8 });
  const radius = 30;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Icon utama */}
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          {/* Teks utama */}
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.message}>
            Your account is ready to use. You will be redirected to the Home
            page in a few seconds.
          </Text>

          {/* Spiral loading animasi */}
          <Animated.View
            style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}
          >
            {dots.map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
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
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SetupCompleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#0D0D0D',
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
    width: '80%',
  },
  iconCircle: {
    backgroundColor: '#00E676',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
  title: {
    color: '#00E676',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    color: '#bbb',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 35,
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
