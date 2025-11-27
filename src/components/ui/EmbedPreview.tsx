import { useEffect, useRef, memo } from "react";
import { getEmbedUrl, getPlatformMeta, type ContentType } from "../../utlis/contentTypeDetection";

interface EmbedPreviewProps {
  url: string;
  type: ContentType;
  title: string;
}

const EmbedPreviewComponent = ({ url, type, title }: EmbedPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedUrl = getEmbedUrl(url, type);
  const platformMeta = getPlatformMeta(type);

  useEffect(() => {
    // Load Twitter widget
    const win = globalThis as typeof globalThis & { twttr?: { widgets: { load: (el?: HTMLElement) => void } } };
    if (type === 'twitter' && win.twttr) {
      win.twttr.widgets.load(containerRef.current || undefined);
    }
    
    // Load Instagram embed script
    const winInsta = globalThis as typeof globalThis & { instgrm?: { Embeds: { process: () => void } } };
    if (type === 'instagram' && winInsta.instgrm) {
      winInsta.instgrm.Embeds.process();
    }
  }, [type, url]);

  // YouTube & Shorts
  if (type === 'youtube' && embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-black shadow-inner">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  // Twitter/X
  if (type === 'twitter') {
    return (
      <div ref={containerRef} className="w-full">
        <blockquote className="twitter-tweet" data-theme="dark">
          <a href={url}>Loading tweet...</a>
        </blockquote>
      </div>
    );
  }

  // Instagram
  if (type === 'instagram' && embedUrl) {
    return (
      <div className="w-full flex justify-center bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-850 rounded-t-xl overflow-hidden py-4">
        <blockquote 
          className="instagram-media" 
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ maxWidth: '540px', width: '100%', margin: 0 }}
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on Instagram
          </a>
        </blockquote>
      </div>
    );
  }

  // TikTok
  if (type === 'tiktok' && embedUrl) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-t-xl overflow-hidden bg-black shadow-inner">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  // Spotify
  if (type === 'spotify' && embedUrl) {
    return (
      <div className="w-full rounded-t-xl overflow-hidden bg-gradient-to-b from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-850">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-80"
          allow="encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  // Vimeo
  if (type === 'vimeo' && embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-black shadow-inner">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // CodePen
  if (type === 'codepen' && embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-gray-900 shadow-inner">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  }

  // Twitch
  if (type === 'twitch' && embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-black shadow-inner">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  }

  // SoundCloud (requires oEmbed API - simplified version)
  if (type === 'soundcloud') {
    return (
      <div className="w-full rounded-t-xl overflow-hidden bg-gradient-to-b from-orange-50 to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4">
        <iframe
          width="100%"
          height="166"
          title={title}
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
          className="rounded-lg"
        />
      </div>
    );
  }

  // LinkedIn, Reddit, Medium, GitHub, Facebook, Pinterest - Show link preview card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full group"
    >
      <div 
        className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 h-48 flex items-center justify-center transition-transform group-hover:scale-[1.02]"
        style={{ 
          background: `linear-gradient(135deg, ${platformMeta.color}15, ${platformMeta.color}05)`
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-3">{platformMeta.icon}</div>
          <div 
            className="text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-white/90 dark:bg-gray-900/90 inline-block"
            style={{ color: platformMeta.color }}
          >
            {type}
          </div>
        </div>
        
        {/* Decorative corner accent */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{ 
            background: `radial-gradient(circle at top right, ${platformMeta.color}, transparent)`
          }}
        />
      </div>
    </a>
  );
};

// Memoize to prevent iframe reloads (keeps videos playing, music playing during refresh)
export const EmbedPreview = memo(EmbedPreviewComponent, (prevProps, nextProps) => {
  // Only re-render if URL or type changed
  return prevProps.url === nextProps.url && prevProps.type === nextProps.type;
});

EmbedPreview.displayName = 'EmbedPreview';

// Extend global window for Instagram embed
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
