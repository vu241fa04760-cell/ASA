const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
]);

const parseYouTubeUrl = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
      return null;
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    const videoId = (url.hostname.toLowerCase().endsWith('youtu.be')
      ? pathParts[0]
      : url.searchParams.get('v') || (
        ['embed', 'v', 'shorts', 'live', 'e'].includes(pathParts[0])
          ? pathParts[1]
          : null
      ));

    return {
      videoId: videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null,
      playlistId: url.searchParams.get('list'),
      searchQuery: url.pathname === '/results' ? url.searchParams.get('search_query') : null,
    };
  } catch {
    return null;
  }
};

export const isYouTubeUrl = (url) => Boolean(parseYouTubeUrl(url));

export const extractYouTubeId = (url) => parseYouTubeUrl(url)?.videoId || null;

export const extractYouTubePlaylistId = (url) => parseYouTubeUrl(url)?.playlistId || null;

export const getYouTubeEmbedUrl = (url) => {
  const parsed = parseYouTubeUrl(url);
  if (parsed?.videoId) {
    return `https://www.youtube-nocookie.com/embed/${parsed.videoId}?autoplay=1&rel=0`;
  }
  if (parsed?.playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(parsed.playlistId)}&autoplay=1`;
  }
  return '';
};

export const getYouTubeExternalUrl = (url, fallbackQuery = 'educational videos') => {
  const parsed = parseYouTubeUrl(url);
  if (parsed?.videoId) {
    return `https://www.youtube.com/watch?v=${parsed.videoId}`;
  }
  if (parsed?.playlistId) {
    return `https://www.youtube.com/playlist?list=${encodeURIComponent(parsed.playlistId)}`;
  }
  return getYouTubeSearchUrl(parsed?.searchQuery || fallbackQuery);
};

export const getYouTubeThumbnail = (url) => {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
};

export const getYouTubeSearchUrl = (query) => (
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
);
