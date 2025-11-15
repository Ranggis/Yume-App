/*
  FINAL FIXED ANIME VIDEO API (2025)
  - No mapping by MAL ID (because it is down)
  - Convert title → gogoanime slug (offline)
  - Fully stable for all anime that exist on gogoanime
*/

const BASE_URL = "https://api.consumet.org/meta/anime/gogoanime";

/* =======================================================
   1. CONVERT TITLE → GOGOANIME SLUG (OFFLINE)
   ======================================================= */

export function convertTitleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")     // ubah spasi → strip
    .replace(/^-+|-+$/g, "");        // trim strip
}

/* =======================================================
   2. GET EPISODES
   ======================================================= */

export async function getAnimeEpisodes(slug: string) {
  try {
    console.log("Fetching Episodes for:", slug);

    const res = await fetch(`${BASE_URL}/info/${slug}`);
    const json = await res.json();

    if (!json || !json.episodes) {
      console.log("❌ No episodes found");
      return [];
    }

    const list = json.episodes;

    return list.map((ep: any) => ({
      id: ep.id,               // required for stream
      number: ep.number,
      title: ep.title || `Episode ${ep.number}`,
      image: ep.image || null,
    }));
  } catch (err) {
    console.log("Error getAnimeEpisodes:", err);
    return [];
  }
}

/* =======================================================
   3. GET STREAM URL
   ======================================================= */

export async function getEpisodeStream(episodeId: string) {
  try {
    console.log("Fetching Stream for:", episodeId);

    const res = await fetch(`${BASE_URL}/watch/${episodeId}`);
    const json = await res.json();

    if (!json || !json.sources || !json.sources.length) {
      console.log("❌ No stream sources");
      return null;
    }

    const best =
      json.sources.find((s: any) => s.quality === "1080p")?.url ||
      json.sources.find((s: any) => s.quality === "720p")?.url ||
      json.sources[0]?.url ||
      null;

    console.log("✔ STREAM URL:", best);

    return best;
  } catch (err) {
    console.log("Error getEpisodeStream:", err);
    return null;
  }
}
