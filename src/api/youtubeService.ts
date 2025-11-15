import Config from 'react-native-config';

const YOUTUBE_API_KEY = Config.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchAnimeTrailers = async (query: string) => {
  try {
    const q = encodeURIComponent(`${query} anime trailer`);
    const url = `${BASE_URL}/search?part=snippet&type=video&maxResults=5&q=${q}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch YouTube data');
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
};
