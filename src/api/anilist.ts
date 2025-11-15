// src/api/anilist.ts

const ANILIST_URL = "https://graphql.anilist.co";

// Universal GraphQL requester
export async function anilistQuery(query: string, variables: any = {}) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.log("AniList API Error:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// Trending Anime (HomeScreen)
export async function getTrendingAnime() {
  const query = `
    query {
      Page(perPage: 20) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
        }
      }
    }
  `;

  const data = await anilistQuery(query);
  return data.Page.media;
}

// Popular Anime
export async function getPopularAnime() {
  const query = `
    query {
      Page(perPage: 20) {
        media(sort: POPULARITY_DESC, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
          averageScore
          seasonYear
          genres
        }
      }
    }
  `;

  const data = await anilistQuery(query);
  return data.Page.media;
}

// Detail Anime
export async function getAnimeDetail(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        episodes
        duration
        description
        coverImage {
          extraLarge
        }
        genres
        averageScore
      }
    }
  `;

  const data = await anilistQuery(query, { id });
  return data.Media;
}

// Search Anime
export async function searchAnime(search: string) {
  const query = `
    query ($search: String) {
      Page(perPage: 20) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const data = await anilistQuery(query, { search });
  return data.Page.media;
}

export async function filterAnime({ query, sort, genre, year }: any) {
  const gql = `
    query ($search: String, $genre: String, $sort: [MediaSort], $year: Int) {
      Page(perPage: 20) {
        media(
          type: ANIME,
          search: $search,
          genre_in: $genre,
          sort: $sort,
          seasonYear: $year
        ) {
          id
          title {
            english
            romaji
          }
          coverImage {
            extraLarge
          }
          averageScore
        }
      }
    }
  `;

  const variables = {
    search: query || null,
    genre: genre === "All" ? null : genre,
    sort:
      sort === "Popularity"
        ? ["POPULARITY_DESC"]
        : ["START_DATE_DESC"],
    year: year === "All" ? null : Number(year),
  };

  const data = await anilistQuery(gql, variables);
  return data.Page.media;
}
