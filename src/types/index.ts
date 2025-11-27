// Shared type definitions across the application

export interface Tag {
  _id: string;
  name: string;
}

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: Tag[];
  createdAt: string;
  userId?: {
    _id: string;
    username: string;
    profilePic?: string;
  };
}

export interface TypeBreakdown {
  _id: string;
  count: number;
}

export interface RecentActivity {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
}

export interface TopTag {
  _id: string;
  name: string;
  count: number;
}

export interface ProfileData {
  username: string;
  email: string;
  profilePic: string;
  bio: string;
  joinedAt: string;
  contentCount: number;
  typeBreakdown: TypeBreakdown[];
  recentActivity: RecentActivity[];
  topTags: TopTag[];
  totalTags: number;
}

export interface DiscoveryData {
  weeklyContent: number;
  monthlyContent: number;
  typeBreakdown: TypeBreakdown[];
  tagStats: TopTag[];
  randomItem?: {
    _id: string;
    title: string;
    link: string;
    type: string;
  };
  onThisDay: Content[];
}

export interface SearchFilters {
  types: string[];
  tags: Tag[];
}

// Utility type helpers
export type ContentType = 'youtube' | 'twitter' | 'article' | 'video' | 'resource' | 'other';

export const TYPE_COLORS: Record<string, string> = {
  youtube: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  twitter: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  article: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  video: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  other: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
};

export const TYPE_EMOJIS: Record<string, string> = {
  youtube: "🎥",
  twitter: "🐦",
  article: "📄",
  video: "📹",
  resource: "📚",
  other: "🔗",
};
