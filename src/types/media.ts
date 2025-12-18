// Media types
export type MediaType = 'image' | 'video' | 'audio' | 'file';

// Media item interface
export interface MediaItem {
  id: string;
  type: MediaType;
  name: string;
  url: string;
  thumbnail?: string;
  size?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio in seconds
  createdAt: Date;
  isExternal: boolean; // true if linked via URL, false if uploaded
}

// Media gallery state
export interface MediaGalleryState {
  items: MediaItem[];
  selectedId: string | null;
  filter: MediaType | 'all';
  searchQuery: string;
}

// Generate unique media ID
export const generateMediaId = (): string => {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get media type from MIME type
export const getMediaTypeFromMime = (mimeType: string): MediaType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
};

// Get media type from file extension or URL
export const getMediaTypeFromExtension = (filename: string): MediaType => {
  // Check if it's a video platform URL
  const url = filename.toLowerCase();
  if (url.includes('youtube.com/watch') || 
      url.includes('youtu.be/') || 
      url.includes('vimeo.com/') || 
      url.includes('dailymotion.com/') ||
      url.includes('twitch.tv/')) {
    return 'video';
  }
  
  // Check if it's an image URL (common image hosting patterns)
  if (url.includes('imgur.com') || 
      url.includes('unsplash.com') || 
      url.includes('pixabay.com') ||
      url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i)) {
    return 'image';
  }

  // Check file extension
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  return 'file';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Format duration
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Convert video platform URLs to embed URLs
export const convertToEmbedUrl = (url: string): string => {
  // YouTube URLs
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  
  // Vimeo URLs
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  
  // For direct video files or other URLs, return as-is
  return url;
};

// Check if URL is a video platform that needs iframe embedding
export const isVideoPlatformUrl = (url: string): boolean => {
  return url.includes('youtube.com/watch') || 
         url.includes('youtu.be/') || 
         url.includes('vimeo.com/') ||
         url.includes('dailymotion.com/') ||
         url.includes('twitch.tv/');
};

// Default placeholder thumbnails by type
export const getPlaceholderThumbnail = (type: MediaType): string => {
  switch (type) {
    case 'image':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
    case 'video':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2"%3E%3Cpolygon points="23 7 16 12 23 17 23 7"%3E%3C/polygon%3E%3Crect x="1" y="5" width="15" height="14" rx="2" ry="2"%3E%3C/rect%3E%3C/svg%3E';
    case 'audio':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2"%3E%3Cpath d="M9 18V5l12-2v13"%3E%3C/path%3E%3Ccircle cx="6" cy="18" r="3"%3E%3C/circle%3E%3Ccircle cx="18" cy="16" r="3"%3E%3C/circle%3E%3C/svg%3E';
    case 'file':
    default:
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2"%3E%3Cpath d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"%3E%3C/path%3E%3Cpolyline points="13 2 13 9 20 9"%3E%3C/polyline%3E%3C/svg%3E';
  }
};
