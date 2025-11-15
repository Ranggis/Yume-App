import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import HeaderBack from '../components/HeaderBack'; // tambahkan header back

const ResetVerificationScreen = ({ navigation }: any) => {
  const CODE_LENGTH = 4; // jumlah digit kode OTP

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(60);

  const inputs = useRef<Array<TextInput | null>>(Array(CODE_LENGTH).fill(null));

  const animValues = useRef<Array<Animated.Value>>(
    Array.from({ length: CODE_LENGTH }, () => new Animated.Value(1))
  ).current;

  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      Animated.spring(bounceAnim, {
        toValue: -40,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000) as unknown as number;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    Animated.sequence([
      Animated.timing(animValues[index], {
        toValue: 1.15,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(animValues[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus?.();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = [...code];
      if (code[index] === '' && index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputs.current[index - 1]?.focus?.();
      } else {
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const resendCode = () => {
    setTimer(60);
    console.log('Resending code...');
  };

  const isFilled = code.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header pakai komponen biar konsisten */}
      <View style={styles.headerWrapper}>
        <HeaderBack title="Forgot Password" onBack={() => navigation.goBack()} />
      </View>

      {/* Input OTP */}
      <Animated.View
        style={[
          styles.innerContainer,
          { transform: [{ translateY: bounceAnim }] },
        ]}
      >
        <Text style={styles.subtitle}>Code has been sent to +1 111 ******99</Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <Animated.View
              key={index}
              style={[
                styles.animatedBox,
                { transform: [{ scale: animValues[index] }] },
              ]}
            >
              <TextInput
                ref={(ref: TextInput | null) => {
                  inputs.current[index] = ref;
                }}
                style={[styles.codeInput, digit ? styles.codeFilled : undefined]}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textContentType="oneTimeCode"
                selectionColor="#00E676"
              />
            </Animated.View>
          ))}
        </View>

        <Text style={styles.timerText}>
          {timer > 0 ? (
            <>
              Resend code in <Text style={styles.timerNumber}>{timer}s</Text>
            </>
          ) : (
            <TouchableOpacity onPress={resendCode}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>
          )}
        </Text>
      </Animated.View>

      {/* Tombol Verify */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { opacity: isFilled ? 1 : 0.5 }]}
          disabled={!isFilled}
          onPress={() => {
            const finalCode = code.join('');
            console.log('Verifying code:', finalCode);
            navigation.navigate('ResetNewPasswordScreen');
          }}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
  },
  headerWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 40,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '70%',
    marginBottom: 30,
  },
  animatedBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInput: {
    width: 55,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333',
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    backgroundColor: '#111',
    marginHorizontal: 5,
  },
  codeFilled: {
    borderColor: '#00E676',
    backgroundColor: '#0A1F0A',
  },
  timerText: {
    color: '#999',
    fontSize: 14,
  },
  timerNumber: {
    color: '#00E676',
    fontWeight: '600',
  },
  resendText: {
    color: '#00E676',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
