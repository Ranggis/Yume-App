export async function jikanRecentEpisodes() {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 20) {
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
              romaji
              english
            }
            episodes
            nextAiringEpisode {
              episode
              airingAt
            }
            coverImage {
              extraLarge
            }
          }
        }
      }
    `;

    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const list = json.data.Page.media;

    return list.map((item: any) => {
      const airing = item.nextAiringEpisode;

      return {
        id: item.id,
        title: item.title.english || item.title.romaji,
        episode: airing ? `Episode ${airing.episode}` : "Episode ?",
        date: airing
          ? new Date(airing.airingAt * 1000).toISOString().split("T")[0]
          : "Unknown",
        image: item.coverImage.extraLarge,
        tag: "Update",
      };
    });
  } catch (err) {
    console.log("AniList API Error:", err);
    return [];
  }
}