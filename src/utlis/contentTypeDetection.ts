// Smart content type detection from URL patterns

export type ContentType = 
  | 'youtube' 
  | 'twitter' 
  | 'instagram' 
  | 'tiktok' 
  | 'linkedin' 
  | 'reddit' 
  | 'medium' 
  | 'github' 
  | 'codepen' 
  | 'spotify' 
  | 'soundcloud' 
  | 'vimeo' 
  | 'twitch' 
  | 'facebook' 
  | 'pinterest'
  | 'article' 
  | 'video' 
  | 'resource' 
  | 'other';

interface URLPattern {
  type: ContentType;
  patterns: RegExp[];
}

const URL_PATTERNS: URLPattern[] = [
  {
    type: 'youtube',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts/i,
    ],
  },
  {
    type: 'twitter',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?twitter\.com/i,
      /(?:https?:\/\/)?(?:www\.)?x\.com/i,
    ],
  },
  {
    type: 'instagram',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?instagram\.com/i,
    ],
  },
  {
    type: 'tiktok',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?tiktok\.com/i,
      /(?:https?:\/\/)?(?:www\.)?vm\.tiktok\.com/i,
    ],
  },
  {
    type: 'linkedin',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com/i,
    ],
  },
  {
    type: 'reddit',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?reddit\.com/i,
      /(?:https?:\/\/)?(?:www\.)?redd\.it/i,
    ],
  },
  {
    type: 'medium',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?medium\.com/i,
      /(?:https?:\/\/)?[a-zA-Z0-9-]+\.medium\.com/i,
    ],
  },
  {
    type: 'github',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?github\.com/i,
    ],
  },
  {
    type: 'codepen',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?codepen\.io/i,
    ],
  },
  {
    type: 'spotify',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?open\.spotify\.com/i,
    ],
  },
  {
    type: 'soundcloud',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?soundcloud\.com/i,
    ],
  },
  {
    type: 'vimeo',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?vimeo\.com/i,
    ],
  },
  {
    type: 'twitch',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?twitch\.tv/i,
    ],
  },
  {
    type: 'facebook',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?facebook\.com/i,
      /(?:https?:\/\/)?(?:www\.)?fb\.watch/i,
    ],
  },
  {
    type: 'pinterest',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?pinterest\.com/i,
      /(?:https?:\/\/)?(?:www\.)?pin\.it/i,
    ],
  },
];

export const detectContentType = (url: string): ContentType => {
  for (const { type, patterns } of URL_PATTERNS) {
    if (patterns.some(pattern => pattern.test(url))) {
      return type;
    }
  }
  return 'other';
};

// Extract embed URL for each platform
export const getEmbedUrl = (url: string, type: ContentType): string | null => {
  switch (type) {
    case 'youtube': {
      // Handle regular videos and shorts
      const videoIdMatch = (/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|shorts\/)([\w-]{11})/).exec(url);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    }
    
    case 'instagram': {
      // Instagram embeds work with /embed/ path
      const match = (/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/).exec(url);
      return match ? `https://www.instagram.com/p/${match[2]}/embed/` : null;
    }
    
    case 'tiktok': {
      // TikTok embeds
      const match = (/(?:https?:\/\/)?(?:www\.|vm\.)?tiktok\.com\/(?:@[\w.-]+\/video\/|v\/)?(\d+)/).exec(url);
      return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
    }
    
    case 'spotify': {
      // Spotify embeds
      const match = (/(?:https?:\/\/)?open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/).exec(url);
      return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
    }
    
    case 'vimeo': {
      // Vimeo embeds
      const match = (/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/).exec(url);
      return match ? `https://player.vimeo.com/video/${match[1]}` : null;
    }
    
    case 'codepen': {
      // CodePen embeds
      const match = (/(?:https?:\/\/)?codepen\.io\/([^/]+)\/pen\/([^/]+)/).exec(url);
      return match ? `https://codepen.io/${match[1]}/embed/${match[2]}?default-tab=result` : null;
    }
    
    case 'soundcloud': {
      // SoundCloud requires oEmbed API, return original URL
      return url;
    }
    
    case 'twitch': {
      // Twitch embeds
      const channelMatch = (/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([^/]+)/).exec(url);
      if (channelMatch) {
        return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${globalThis.location.hostname}`;
      }
      const videoMatch = (/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)/).exec(url);
      return videoMatch ? `https://player.twitch.tv/?video=${videoMatch[1]}&parent=${globalThis.location.hostname}` : null;
    }
    
    default:
      return null;
  }
};

// Get platform icon/color
export const getPlatformMeta = (type: ContentType) => {
  const meta: Record<ContentType, { color: string; icon: string }> = {
    youtube: { color: '#FF0000', icon: '▶️' },
    twitter: { color: '#1DA1F2', icon: '𝕏' },
    instagram: { color: '#E4405F', icon: '📷' },
    tiktok: { color: '#000000', icon: '🎵' },
    linkedin: { color: '#0077B5', icon: '💼' },
    reddit: { color: '#FF4500', icon: '🔴' },
    medium: { color: '#000000', icon: 'Ⓜ️' },
    github: { color: '#181717', icon: '🐙' },
    codepen: { color: '#000000', icon: '✏️' },
    spotify: { color: '#1DB954', icon: '🎧' },
    soundcloud: { color: '#FF5500', icon: '🎵' },
    vimeo: { color: '#1AB7EA', icon: '▶️' },
    twitch: { color: '#9146FF', icon: '🎮' },
    facebook: { color: '#1877F2', icon: '👥' },
    pinterest: { color: '#E60023', icon: '📌' },
    article: { color: '#6366F1', icon: '📄' },
    video: { color: '#8B5CF6', icon: '🎬' },
    resource: { color: '#10B981', icon: '📚' },
    other: { color: '#6B7280', icon: '🔗' },
  };
  
  return meta[type] || meta.other;
};
