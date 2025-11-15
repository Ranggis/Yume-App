// src/api/jikan.ts

const BASE_URL = "https://api.jikan.moe/v4";

// Search Anime
export async function jikanSearchAnime(query: string) {
  const res = await fetch(`${BASE_URL}/anime?q=${query}&order_by=popularity`);
  const json = await res.json();
  return json.data;
}

// Top Anime
export async function jikanTopAnime() {
  const res = await fetch(`${BASE_URL}/top/anime`);
  const json = await res.json();
  return json.data;
}

// Anime Detail
export async function jikanAnimeById(id: number) {
  const res = await fetch(`${BASE_URL}/anime/${id}/full`);
  const json = await res.json();
  return json.data;
}

// New Releases (simulasi schedule)
export async function jikanSeasonNow() {
  const res = await fetch(`${BASE_URL}/seasons/now`);
  const json = await res.json();
  return json.data;
}

// Anime by Genre (untuk More Like This)
export async function jikanAnimeByGenre(genreId: number, page: number = 1) {
  const res = await fetch(`${BASE_URL}/anime?genres=${genreId}&page=${page}`);
  const json = await res.json();
  return json.data;
}
