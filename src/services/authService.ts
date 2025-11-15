import auth from '@react-native-firebase/auth';

// Fungsi login
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Fungsi register
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Fungsi logout
export const logoutUser = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
