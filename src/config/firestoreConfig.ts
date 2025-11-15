// src/config/firestoreConfig.ts
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * 🔥 FIRESTORE CONFIG MODULE
 *  - Koleksi: animes, users, favorites
 *  - Fungsi CRUD (Create, Read, Update, Delete)
 */

/*  TYPE DEFINITIONS */
export interface Anime {
  id: string;
  title: string;
  genre: string[];
  rating: number;
  thumbnail: string;
  videoUrl: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  favorites: string[]; // array of anime IDs
}

/* ANIME COLLECTION */

// Tambah anime baru
export const addAnime = async (anime: Anime) => {
  try {
    await firestore().collection('animes').doc(anime.id).set(anime);
    console.log('✅ Anime berhasil ditambahkan:', anime.title);
  } catch (error) {
    console.error('❌ Gagal menambah anime:', error);
  }
};

// Ambil semua anime
export const getAllAnimes = async (): Promise<Anime[]> => {
  try {
    const snapshot = await firestore().collection('animes').get();
    const animes = snapshot.docs.map(doc => doc.data() as Anime);
    console.log('📦 Data anime:', animes);
    return animes;
  } catch (error) {
    console.error('❌ Gagal mengambil data anime:', error);
    return [];
  }
};

// Ambil anime berdasarkan ID
export const getAnimeById = async (id: string): Promise<Anime | null> => {
  try {
    const doc: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> =
      await firestore().collection('animes').doc(id).get();

    if (doc.exists()) {  // ✅ pakai exists() untuk versi terbaru
      const data = doc.data() as Anime;
      console.log('🎬 Detail anime:', data);
      return data;
    } else {
      console.log('⚠️ Anime tidak ditemukan');
      return null;
    }
  } catch (error) {
    console.error('❌ Gagal mengambil anime:', error);
    return null;
  }
};

// Hapus anime
export const deleteAnime = async (id: string) => {
  try {
    await firestore().collection('animes').doc(id).delete();
    console.log('🗑️ Anime berhasil dihapus:', id);
  } catch (error) {
    console.error('❌ Gagal menghapus anime:', error);
  }
};

/* USER COLLECTION */

// Tambah user baru (misalnya setelah register)
export const addUser = async (user: User) => {
  try {
    await firestore().collection('users').doc(user.uid).set(user);
    console.log('👤 User berhasil ditambahkan:', user.email);
  } catch (error) {
    console.error('❌ Gagal menambah user:', error);
  }
};

// Ambil user berdasarkan UID
export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists()) {  // ✅ pakai exists()
      const data = doc.data() as User;
      console.log('👥 Detail user:', data);
      return data;
    } else {
      console.log('⚠️ User tidak ditemukan');
      return null;
    }
  } catch (error) {
    console.error('❌ Gagal mengambil user:', error);
    return null;
  }
};

/* FAVORITES COLLECTION */

// Tambah anime ke daftar favorit user
export const addFavorite = async (userId: string, animeId: string) => {
  try {
    const userRef = firestore().collection('users').doc(userId);
    await userRef.update({
      favorites: firestore.FieldValue.arrayUnion(animeId),
    });
    console.log(`💖 Anime ${animeId} ditambahkan ke favorit user ${userId}`);
  } catch (error) {
    console.error('❌ Gagal menambah ke favorit:', error);
  }
};

// Hapus anime dari daftar favorit user
export const removeFavorite = async (userId: string, animeId: string) => {
  try {
    const userRef = firestore().collection('users').doc(userId);
    await userRef.update({
      favorites: firestore.FieldValue.arrayRemove(animeId),
    });
    console.log(`💔 Anime ${animeId} dihapus dari favorit user ${userId}`);
  } catch (error) {
    console.error('❌ Gagal menghapus favorit:', error);
  }
};

// Ambil semua anime favorit user
export const getFavorites = async (userId: string): Promise<Anime[]> => {
  try {
    const user = await getUserById(userId);
    if (!user || !user.favorites.length) return [];

    const animeRefs = user.favorites.map(id =>
      firestore().collection('animes').doc(id).get()
    );

    const snapshots = await Promise.all(animeRefs);
    const favorites = snapshots
      .filter(doc => doc.exists())  
      .map(doc => doc.data() as Anime);

    console.log('⭐ Favorit user:', favorites);
    return favorites;
  } catch (error) {
    console.error('❌ Gagal mengambil daftar favorit:', error);
    return [];
  }
};
