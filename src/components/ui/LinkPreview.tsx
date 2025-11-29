import { useState, useEffect } from 'react';
import apiClient from '../../utlis/apiClient';

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

interface LinkPreviewProps {
  url: string;
  title: string;
  platformIcon: string;
  platformColor: string;
  platformType: string;
}

export const LinkPreview = ({ url, title, platformIcon, platformColor, platformType }: LinkPreviewProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);

        // Call backend API to fetch metadata (avoids CORS issues)
        const response = await apiClient.post('/link-preview/fetch-metadata', { url });
        
        console.log('Link preview response:', response.data);
        
        if (response.data.success && response.data.metadata) {
          setMetadata(response.data.metadata);
        } else {
          throw new Error('Failed to fetch metadata');
        }
      } catch (error) {
        console.error('Failed to fetch link metadata:', error);
        console.log('Using fallback metadata for:', url);
        // Use fallback data
        setMetadata({
          title: title || 'Saved Link',
          description: url,
          image: '',
          siteName: new URL(url).hostname
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [url, title]);

  if (isLoading) {
    return (
      <div className="w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 h-48 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-2">{platformIcon}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full group"
    >
      <div className="relative overflow-hidden rounded-t-xl bg-white dark:bg-gray-800 transition-transform group-hover:scale-[1.01]">
        {/* Image preview */}
        {metadata?.image ? (
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <img 
              src={metadata.image} 
              alt={metadata.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Platform badge overlay */}
            <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <span className="text-lg">{platformIcon}</span>
              <span className="text-xs font-semibold uppercase" style={{ color: platformColor }}>
                {platformType}
              </span>
            </div>
          </div>
        ) : (
          // Fallback gradient with platform icon
          <div 
            className="relative w-full h-48 flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${platformColor}15, ${platformColor}05)`
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-3">{platformIcon}</div>
              <div 
                className="text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-white/90 dark:bg-gray-900/90 inline-block"
                style={{ color: platformColor }}
              >
                {platformType}
              </div>
            </div>
          </div>
        )}

        {/* Content info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">{platformIcon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {metadata?.title || title}
              </h3>
              {metadata?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {metadata.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {metadata?.siteName || new URL(url).hostname}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs" style={{ color: platformColor }}>
                  View →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
