# Yume Anime Streaming App

<p align="center">
  <img src="https://github.com/Ranggis/Yume-App/blob/main/assets/logo.png" alt="Yume Logo" width="300" />
</p>

## Vision & Essence of Yume

Yume dibangun dengan satu filosofi: menghadirkan pengalaman menonton anime yang terasa modern, lembut, cepat, dan penuh sentuhan sinematik. Aplikasi ini tidak sekadar menjadi katalog anime—tetapi sebuah ruang digital yang menyatukan estetika, performa, serta kemudahan eksplorasi.

Setiap elemen desain dibuat untuk meninggalkan kesan sejak detik pertama: dari warna aksen hijau neon yang tegas namun elegan, animasi halus saat navigasi, hingga pengalaman menonton yang terasa imersif dengan video player gaya full-production.

Yume bukan hanya aplikasi, tapi pengalaman.

---

## Tujuan Pengembangan

Proyek ini lahir dari kebutuhan untuk menggabungkan beberapa kekuatan inti dalam satu platform:

* Sistem pencarian anime yang cepat dan relevan.
* Detail anime yang informatif dan sinematik.
* Video player profesional dengan UI modern.
* Fitur MyList dan Release Calendar yang responsif dan intuitif.
* Desain antarmuka yang konsisten dan berkesan premium.

Yume diarahkan menjadi aplikasi penanda standar baru untuk mobile anime streaming experience.

---

## Mengapa Yume Berbeda?

### 1. Desain bernuansa cinematic & futuristik

Setiap halaman dirancang agar terasa seperti tampilan platform kelas premium.

### 2. Performa tinggi

Optimasi API, efisiensi state management, dan pemrosesan gambar membuat pengalaman browsing terasa instan.

### 3. Pengalaman menonton yang total

Video player lengkap dengan gesture, drawer episode, timebar custom, dan mode landscape otomatis.

### 4. Struktur kode yang terorganisir

Setiap fitur dipisahkan pada folder terstruktur, mudah dikembangkan untuk production.

---

## Struktur Besar Aplikasi

* Home Screen – Hero banner, trending carousel, rekomendasi cepat.
* Search Screen – Smart filtering, hasil realtime, UI clean.
* Anime Detail Screen – Layout premium dengan tabs, sinopsis, metadata, episode, rekomendasi.
* Video Player Screen – Player full custom ala OOT/Premium.
* My List – Penyimpanan lokal dengan toggle interaktif.
* Release Calendar – Jadwal rilis anime lengkap + fitur MyList.
* Top Hits – Data populer dari AniList.
* Notification – Episode terbaru dalam tampilan compact.

---

## Screenshot Aplikasi

<p align="center">
  <img src="screens/home.png" width="260" />
  <img src="screens/detail.png" width="260" />
  <img src="screens/player.png" width="260" />
</p>
<p align="center">
  <img src="screens/search.png" width="260" />
  <img src="screens/mylist.png" width="260" />
  <img src="screens/calendar.png" width="260" />
</p>

---

## Project Criteria

Berikut tabel adaptasi Project Criteria:

| Aspek         | Keterangan                                                |
| ------------- | --------------------------------------------------------- |
| Nama Aplikasi | Yume Anime Streaming App                                  |
| Platform      | Android (React Native CLI)                                |
| Fitur Utama   | Streaming, MyList, Detail, Player, Calendar, Notification |
| API           | Jikan, AniList, Consumet                                  |
| Navigasi      | Stack + Bottom Tab                                        |
| UI Style      | Futuristik, minimal, neon green                           |
| Target User   | Penonton anime modern                                     |

---

## Filosofi Desain Yume

### Konsistensi Warna

Aksen hijau neon (#00C853) sebagai identitas visual yang kuat.

### Kontras Gelap & Cahaya

Background hitam pekat agar ilustrasi anime terlihat cinematic.

### Motion & Transitions

Animasi fade, slide, dan scale untuk kenyamanan visual.

### Clean Typography

Font rapi agar nyaman saat browsing konten.

---

## API & Data Flow

Menggunakan **Jikan API**, **AniList GraphQL**, dan custom streaming provider.

**Homepage:** trending & top airing.

**Search:** filter berdasarkan kategori, genre, tahun.

**Detail:** metadata lengkap, recommended, visual HD.

**Player:** full streaming.

**Calendar:** real-time airing schedule.

---

## Arsitektur Screen & Navigasi

```
AnimeStreamingApp
 ├── _tests-
 ├── .bundle
 ├── android
 ├── assets
 ├── ios
 ├── node_modules
 ├── src
 │   ├── api
 │   │   ├── anilist.ts
 │   │   ├── animeVideo.ts
 │   │   ├── jikan.ts
 │   │   ├── jikanNotifications.ts
 │   │   └── youtubeService.ts
 │   ├── config
 │   │   ├── firebaseConfig.ts
 │   │   └── firestoreConfig.ts
 │   ├── context
 │   │   └── CommentContext.tsx
 │   ├── manager
 │   │   └── DownloadManager.ts
 │   ├── navigation
 │   │   ├── AppNavigator.tsx
 │   │   └── MainTabs.tsx
 │   ├── screens
 │   │   ├── account_setup
 │   │   ├── anime_details
 │   │   ├── auth
 │   │   ├── comments
 │   │   ├── components
 │   │   ├── download
 │   │   ├── home
 │   │   ├── main
 │   │   ├── mylist
 │   │   ├── profil
 │   │   ├── realase_calender
 │   │   └── video
 │   ├── services
 │   │   └── authService.ts
 │   └── types
 │   │   └── react-native-video.d.ts
```

---

## Alur Pengembangan

1. Mockup UI
2. Struktur folder
3. Navigasi
4. API integrasi
5. UI detail
6. Player custom
7. MyList logic
8. Optimasi
9. Build release
10. Dokumentasi README profesional

---

## Instalasi

```
npm install
yarn android
```

---

## Lisensi

Proyek ini dikembangkan untuk tujuan edukasi dan pengembangan aplikasi streaming anime modern.

## Screenshots

Below is a structured table presenting key UI components and screens of the **Yume Anime Streaming App**.

| Screen              | Description                                                             | Screenshot                   |
| ------------------- | ----------------------------------------------------------------------- | ---------------------------- |
| Home Screen         | Beranda utama dengan kategori populer dan rekomendasi.                  | *(Tambahkan gambar di sini)* |
| Anime Detail Screen | Detail lengkap anime: sinopsis, genre, rating, dan rekomendasi terkait. | *(Tambahkan gambar di sini)* |
| Video Player        | Pemutar video landscape dengan daftar episode interaktif.               | *(Tambahkan gambar di sini)* |
| Search Screen       | Pencarian dengan filter genre, tahun, region, dan popularitas.          | *(Tambahkan gambar di sini)* |
| My List             | Kumpulan anime favorit pengguna.                                        | *(Tambahkan gambar di sini)* |
| Notification        | Daftar episode terbaru berdasarkan jadwal airing.                       | *(Tambahkan gambar di sini)* |
| Release Calendar    | Kalender rilis real-time.                                               | *(Tambahkan gambar di sini)* |

---

## Project Criteria & Assessment Table

| Kriteria           | Bobot | Penjelasan                                                |
| ------------------ | ----- | --------------------------------------------------------- | 
| Deskripsi Masalah  | 10%   | Menjelaskan kebutuhan dan urgensi aplikasi bagi pengguna. | 
| Tujuan Sistem      | 10%   | Menjabarkan hasil akhir yang ingin dicapai aplikasi.      | 
| Ruang Lingkup      | 10%   | Batasan fungsional aplikasi dan fitur utama.              | 
| Fitur Utama        | 15%   | Kesesuaian fitur dengan kebutuhan dan konsistensi UX.     |
| Arsitektur Sistem  | 10%   | Desain struktur aplikasi dan integrasi API.               |
| Desain UI/UX       | 10%   | Konsistensi visual, kemudahan navigasi, dan estetika.     |
| Kinerja & Optimasi | 10%   | Kecepatan load, efisiensi API, dan caching.               |
| Keamanan           | 5%    | Perlindungan data pengguna dan sanitasi input.            |
| Pengujian Sistem   | 10%   | Ketersediaan test case dan evaluasi performa.             |
| Dokumentasi        | 10%   | Kelengkapan README dan instruksi penggunaan.              |

## Installation

Berikut adalah langkah instalasi lengkap untuk menjalankan aplikasi Anime Streaming App secara lokal maupun di perangkat fisik.

### 1. Persiapan Awal

Pastikan seluruh tools berikut terinstal:

* Node.js (versi LTS terbaru)
* JDK 17
* Android Studio + Android SDK
* Git

Verifikasi:

```
node -v
npm -v
java -version
```

### 2. Clone Repository

```
git clone https://github.com/username/anime-streaming-app.git
cd anime-streaming-app
```

### 3. Install Dependencies

```
npm install
```

### 4. Build & Run

Android:

```
npx react-native run-android
```

iOS:

```
npx react-native run-ios
```

### 5. Build Release (Android)

```
cd android
./gradlew assembleRelease
```

APK akan muncul di:

```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern:

### Frontend Mobile

* React Native 0.82+
* TypeScript
* React Navigation (Stack, Tabs, Drawer)
* React Native Vector Icons
* React Native Video
* Animated API

### API Providers

* Jikan API (anime, episode, genre)
* AniList GraphQL API (trending, airing)

### State Management

* React Hooks (useState, useEffect, useRef)

### Media & UI Components

* ImageBackground
* FlatList Optimized
* Custom Video Player + Episode Drawer

### Utilities

* Time formatting helpers
* Runtime validation

## Running the Project (React Native CLI Guide)

This project is built using **React Native CLI**, giving developers full control over the native ecosystem. Below is a complete guide for setting up, running, and modifying the application.

---

### Step 1: Start Metro

Metro is the JavaScript bundler used by React Native.

To start Metro:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

---

### Step 2: Build and Run the App

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

Before building iOS, install CocoaPods dependencies:

```sh
# Install bundler (only first time)
bundle install

# Install pods\ nbundle exec pod install
```

Then run:

```sh
npm run ios
# OR
yarn ios
```

If setup is correct, the app will start on your emulator, simulator, or physical device.

---

### Step 3: Modify the App

Edit any file (e.g., `App.tsx`), save it, and the app will refresh using **Fast Refresh**.

#### Full Reload

* **Android**: Press `R` twice or open Dev Menu using `Ctrl+M` (Windows/Linux) or `Cmd+M` (macOS)
* **iOS**: Press `R` in the simulator

---

## Learn More

* React Native Docs: [https://reactnative.dev](https://reactnative.dev)
* Environment Setup: [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)
* Basics Guide: [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
* Blog: [https://reactnative.dev/blog](https://reactnative.dev/blog)
* GitHub Repo: [https://github.com/facebook/react-native](https://github.com/facebook/react-native)

---
