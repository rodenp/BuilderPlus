import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Image,
  Video,
  Music,
  FileText,
  Upload,
  Link,
  Search,
  Trash2,
  Check,
  X,
  Grid,
  List,
  ExternalLink,
  Plus,
  ArrowLeft,
  Edit3,
  Calendar,
  HardDrive,
  Maximize2,
  Clock,
  Copy,
  LinkIcon,
} from 'lucide-react';
import type { Theme } from './property-panel/theme';
import type { MediaItem, MediaType } from '../../types/media';
import {
  generateMediaId,
  getMediaTypeFromExtension,
  getMediaTypeFromMime,
  formatFileSize,
  formatDuration,
} from '../../types/media';

interface MediaGalleryProps {
  theme: Theme;
  items: MediaItem[];
  onItemsChange: (items: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onInsert?: (item: MediaItem) => void;
  allowedTypes?: MediaType[];
  title?: string;
}

type ViewMode = 'grid' | 'list';
type AddMode = 'none' | 'upload' | 'url';
type PanelMode = 'gallery' | 'detail';

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  theme,
  items,
  onItemsChange,
  selectedId,
  onSelect,
  onInsert,
  allowedTypes = ['image', 'video', 'audio', 'file'],
  title = 'Media Gallery',
}) => {
  const [filter, setFilter] = useState<MediaType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [addMode, setAddMode] = useState<AddMode>('none');
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('gallery');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get selected item
  const selectedItem = selectedId ? items.find((i) => i.id === selectedId) : null;

  // When selection changes, update editing item
  useEffect(() => {
    if (selectedItem && panelMode === 'detail') {
      setEditingItem({ ...selectedItem });
    }
  }, [selectedItem, panelMode]);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAllowedTypes = allowedTypes.includes(item.type);
    return matchesFilter && matchesSearch && matchesAllowedTypes;
  });

  // Get icon for media type
  const getTypeIcon = (type: MediaType, size = 16) => {
    const style = { width: size, height: size };
    switch (type) {
      case 'image':
        return <Image style={style} />;
      case 'video':
        return <Video style={style} />;
      case 'audio':
        return <Music style={style} />;
      case 'file':
      default:
        return <FileText style={style} />;
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newItems: MediaItem[] = [];

      Array.from(files).forEach((file) => {
        // Try MIME type first, then fall back to extension
        const type = file.type ? getMediaTypeFromMime(file.type) : getMediaTypeFromExtension(file.name);
        if (!allowedTypes.includes(type)) return;

        const url = URL.createObjectURL(file);

        const item: MediaItem = {
          id: generateMediaId(),
          type,
          name: file.name,
          url,
          size: file.size,
          mimeType: file.type,
          createdAt: new Date(),
          isExternal: false,
        };

        // For images, get dimensions and set thumbnail
        if (type === 'image') {
          item.thumbnail = url;
          const img = new window.Image();
          img.onload = () => {
            // Use functional update to get latest state
            onItemsChange((prevItems: MediaItem[]) =>
              prevItems.map((i) =>
                i.id === item.id
                  ? { ...i, width: img.width, height: img.height }
                  : i
              )
            );
          };
          img.src = url;
        }

        // For video, get duration and generate thumbnail
        if (type === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.onloadedmetadata = () => {
            // Seek to 1 second or 10% of video for thumbnail
            video.currentTime = Math.min(1, video.duration * 0.1);
          };
          video.onseeked = () => {
            // Generate thumbnail from video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
              // Use functional update to get latest state
              onItemsChange((prevItems: MediaItem[]) =>
                prevItems.map((i) =>
                  i.id === item.id
                    ? { ...i, duration: video.duration, width: video.videoWidth, height: video.videoHeight, thumbnail }
                    : i
                )
              );
            }
            // Don't revoke the URL here - the video player needs it to play the video
          };
          video.onerror = () => {
            // If thumbnail generation fails, still update metadata
            onItemsChange((prevItems: MediaItem[]) =>
              prevItems.map((i) =>
                i.id === item.id
                  ? { ...i, duration: video.duration || 0, width: video.videoWidth || 0, height: video.videoHeight || 0 }
                  : i
              )
            );
          };
          video.src = url;
        }

        // For audio, get duration
        if (type === 'audio') {
          const audio = document.createElement('audio');
          audio.onloadedmetadata = () => {
            // Use functional update to get latest state
            onItemsChange((prevItems: MediaItem[]) =>
              prevItems.map((i) =>
                i.id === item.id ? { ...i, duration: audio.duration } : i
              )
            );
          };
          audio.src = url;
        }

        newItems.push(item);
      });

      onItemsChange([...items, ...newItems]);
      setAddMode('none');
      
      // Auto-select the most recently uploaded item (last in array)
      if (newItems.length > 0) {
        onSelect(newItems[newItems.length - 1].id);
      }
    },
    [items, onItemsChange, allowedTypes]
  );

  // Handle URL add
  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    console.log('Adding URL media item:', urlInput);
    const type = getMediaTypeFromExtension(urlInput);
    const name = urlName.trim() || urlInput.split('/').pop() || 'Untitled';

    const item: MediaItem = {
      id: generateMediaId(),
      type,
      name,
      url: urlInput,
      thumbnail: type === 'image' ? urlInput : undefined,
      createdAt: new Date(),
      isExternal: true,
    };

    console.log('Created media item:', item);
    console.log('Current items before adding:', items);
    
    const newItems = [...items, item];
    console.log('New items array:', newItems);
    
    onItemsChange(newItems);
    setUrlInput('');
    setUrlName('');
    setAddMode('none');
    
    // Auto-select the newly added URL item
    onSelect(item.id);
    console.log('URL media item added and selected');
  };

  // Handle delete
  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && !item.isExternal) {
      URL.revokeObjectURL(item.url);
    }
    onItemsChange(items.filter((i) => i.id !== id));
    if (selectedId === id) {
      onSelect(null);
      setPanelMode('gallery');
    }
  };

  // Handle item update
  const handleUpdateItem = (updatedItem: MediaItem) => {
    onItemsChange(items.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    setEditingItem(updatedItem);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Open detail view
  const openDetailView = (item: MediaItem) => {
    onSelect(item.id);
    setEditingItem({ ...item });
    setPanelMode('detail');
  };

  // Copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onInsert && selectedItem) {
      e.preventDefault();
      onInsert(selectedItem);
    } else if (e.key === 'Enter' && onInsert && !selectedItem) {
      // Prevent Enter when no item is selected
      e.preventDefault();
    }
  };

  // Styles
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: theme.textMuted,
    transition: 'all 0.15s',
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.primaryBg,
    borderColor: theme.primary,
    color: theme.primaryText,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '6px',
    color: theme.text,
    fontSize: '13px',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: theme.textMuted,
    marginBottom: '4px',
    fontWeight: 500,
  };

  const metaRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: `1px solid ${theme.border}`,
    fontSize: '12px',
  };

  // Render detail/edit view
  if (panelMode === 'detail' && editingItem) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: theme.bg,
        }}
      >
        {/* Detail Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <button
            onClick={() => setPanelMode('gallery')}
            style={{ ...buttonStyle, padding: '6px' }}
            title="Back to gallery"
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: theme.text,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Edit Media
          </h3>
          <button
            onClick={() => handleDelete(editingItem.id)}
            style={{ ...buttonStyle, padding: '6px', color: '#ef4444' }}
            title="Delete"
          >
            <Trash2 style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Preview */}
        <div
          style={{
            padding: '16px',
            backgroundColor: theme.bgSecondary,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              aspectRatio: '16/9',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: theme.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {editingItem.type === 'image' ? (
              <img
                src={editingItem.url}
                alt={editingItem.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : editingItem.type === 'video' ? (
              <video
                key={editingItem.id}
                controls
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              >
                <source src={editingItem.url} type={editingItem.mimeType || 'video/mp4'} />
              </video>
            ) : editingItem.type === 'audio' ? (
              <div style={{ width: '100%', padding: '0 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Music style={{ width: 48, height: 48, color: theme.textMuted }} />
                </div>
                <audio src={editingItem.url} controls style={{ width: '100%' }} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: theme.textMuted }}>
                {getTypeIcon(editingItem.type, 48)}
                <p style={{ marginTop: '8px', fontSize: '12px' }}>
                  {editingItem.mimeType || 'File'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {/* Editable Properties */}
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Edit3 style={{ width: 14, height: 14 }} />
              Properties
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) =>
                  handleUpdateItem({ ...editingItem, name: e.target.value })
                }
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>URL</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) =>
                    handleUpdateItem({ ...editingItem, url: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                  readOnly={!editingItem.isExternal}
                />
                <button
                  onClick={() => copyToClipboard(editingItem.url)}
                  style={buttonStyle}
                  title="Copy URL"
                >
                  <Copy style={{ width: 14, height: 14 }} />
                </button>
              </div>
              {!editingItem.isExternal && (
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '10px',
                    color: theme.textMuted,
                  }}
                >
                  Local file - URL cannot be edited
                </p>
              )}
            </div>

            {editingItem.type === 'image' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Alt Text</label>
                <input
                  type="text"
                  value={(editingItem as MediaItem & { alt?: string }).alt || ''}
                  onChange={(e) =>
                    handleUpdateItem({ ...editingItem, alt: e.target.value } as MediaItem)
                  }
                  placeholder="Describe the image..."
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText style={{ width: 14, height: 14 }} />
              Metadata
            </h4>

            <div style={metaRowStyle}>
              <span style={{ color: theme.textMuted }}>
                {getTypeIcon(editingItem.type, 14)}
              </span>
              <span style={{ color: theme.textMuted }}>Type</span>
              <span style={{ marginLeft: 'auto', color: theme.text, textTransform: 'capitalize' }}>
                {editingItem.type}
              </span>
            </div>

            {editingItem.mimeType && (
              <div style={metaRowStyle}>
                <span style={{ color: theme.textMuted }}>
                  <FileText style={{ width: 14, height: 14 }} />
                </span>
                <span style={{ color: theme.textMuted }}>MIME Type</span>
                <span style={{ marginLeft: 'auto', color: theme.text, fontSize: '11px' }}>
                  {editingItem.mimeType}
                </span>
              </div>
            )}

            {editingItem.size && (
              <div style={metaRowStyle}>
                <span style={{ color: theme.textMuted }}>
                  <HardDrive style={{ width: 14, height: 14 }} />
                </span>
                <span style={{ color: theme.textMuted }}>File Size</span>
                <span style={{ marginLeft: 'auto', color: theme.text }}>
                  {formatFileSize(editingItem.size)}
                </span>
              </div>
            )}

            {(editingItem.width || editingItem.height) && (
              <div style={metaRowStyle}>
                <span style={{ color: theme.textMuted }}>
                  <Maximize2 style={{ width: 14, height: 14 }} />
                </span>
                <span style={{ color: theme.textMuted }}>Dimensions</span>
                <span style={{ marginLeft: 'auto', color: theme.text }}>
                  {editingItem.width} × {editingItem.height} px
                </span>
              </div>
            )}

            {editingItem.duration && (
              <div style={metaRowStyle}>
                <span style={{ color: theme.textMuted }}>
                  <Clock style={{ width: 14, height: 14 }} />
                </span>
                <span style={{ color: theme.textMuted }}>Duration</span>
                <span style={{ marginLeft: 'auto', color: theme.text }}>
                  {formatDuration(editingItem.duration)}
                </span>
              </div>
            )}

            <div style={metaRowStyle}>
              <span style={{ color: theme.textMuted }}>
                <Calendar style={{ width: 14, height: 14 }} />
              </span>
              <span style={{ color: theme.textMuted }}>Added</span>
              <span style={{ marginLeft: 'auto', color: theme.text }}>
                {new Date(editingItem.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ ...metaRowStyle, borderBottom: 'none' }}>
              <span style={{ color: theme.textMuted }}>
                <LinkIcon style={{ width: 14, height: 14 }} />
              </span>
              <span style={{ color: theme.textMuted }}>Source</span>
              <span style={{ marginLeft: 'auto', color: theme.text }}>
                {editingItem.isExternal ? 'External URL' : 'Uploaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            gap: '8px',
          }}
        >
          {onInsert && (
            <button
              onClick={() => {
                onInsert(editingItem);
                setPanelMode('gallery');
              }}
              style={{
                ...buttonStyle,
                flex: 1,
                gap: '6px',
                padding: '10px',
                backgroundColor: theme.primary,
                color: '#fff',
                borderColor: theme.primary,
              }}
            >
              <Check style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: '12px' }}>Insert</span>
            </button>
          )}
          <button
            onClick={() => setPanelMode('gallery')}
            style={{
              ...buttonStyle,
              flex: onInsert ? 0 : 1,
              padding: '10px',
            }}
          >
            <span style={{ fontSize: '12px' }}>Done</span>
          </button>
        </div>
      </div>
    );
  }

  // Render gallery view
  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.bg,
        outline: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: theme.text,
            }}
          >
            {title}
          </h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={viewMode === 'grid' ? activeButtonStyle : buttonStyle}
              title="Grid view"
            >
              <Grid style={{ width: 14, height: 14 }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={viewMode === 'list' ? activeButtonStyle : buttonStyle}
              title="List view"
            >
              <List style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
              color: theme.textMuted,
            }}
          />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: '32px',
            }}
          />
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={filter === 'all' ? activeButtonStyle : buttonStyle}
          >
            <span style={{ fontSize: '12px' }}>All</span>
          </button>
          {allowedTypes.includes('image') && (
            <button
              onClick={() => setFilter('image')}
              style={filter === 'image' ? activeButtonStyle : buttonStyle}
              title="Images"
            >
              <Image style={{ width: 14, height: 14 }} />
            </button>
          )}
          {allowedTypes.includes('video') && (
            <button
              onClick={() => setFilter('video')}
              style={filter === 'video' ? activeButtonStyle : buttonStyle}
              title="Videos"
            >
              <Video style={{ width: 14, height: 14 }} />
            </button>
          )}
          {allowedTypes.includes('audio') && (
            <button
              onClick={() => setFilter('audio')}
              style={filter === 'audio' ? activeButtonStyle : buttonStyle}
              title="Audio"
            >
              <Music style={{ width: 14, height: 14 }} />
            </button>
          )}
          {allowedTypes.includes('file') && (
            <button
              onClick={() => setFilter('file')}
              style={filter === 'file' ? activeButtonStyle : buttonStyle}
              title="Files"
            >
              <FileText style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* Add buttons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={() => setAddMode(addMode === 'upload' ? 'none' : 'upload')}
          style={{
            ...buttonStyle,
            flex: 1,
            gap: '6px',
            padding: '8px 12px',
            backgroundColor:
              addMode === 'upload' ? theme.primaryBg : theme.bgSecondary,
            color: addMode === 'upload' ? theme.primaryText : theme.text,
          }}
        >
          <Upload style={{ width: 14, height: 14 }} />
          <span style={{ fontSize: '12px' }}>Upload</span>
        </button>
        <button
          onClick={() => setAddMode(addMode === 'url' ? 'none' : 'url')}
          style={{
            ...buttonStyle,
            flex: 1,
            gap: '6px',
            padding: '8px 12px',
            backgroundColor:
              addMode === 'url' ? theme.primaryBg : theme.bgSecondary,
            color: addMode === 'url' ? theme.primaryText : theme.text,
          }}
        >
          <Link style={{ width: 14, height: 14 }} />
          <span style={{ fontSize: '12px' }}>Link URL</span>
        </button>
      </div>

      {/* Upload area */}
      {addMode === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            margin: '12px 16px',
            padding: '24px',
            border: `2px dashed ${isDragOver ? theme.primary : theme.border}`,
            borderRadius: '8px',
            backgroundColor: isDragOver ? theme.primaryBg : theme.bgSecondary,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Plus
            style={{
              width: 32,
              height: 32,
              color: isDragOver ? theme.primary : theme.textMuted,
              marginBottom: '8px',
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: theme.text,
              marginBottom: '4px',
            }}
          >
            {isDragOver ? 'Drop files here' : 'Click or drag files to upload'}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.textMuted }}>
            Supports images, videos, audio, and documents
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes
              .map((t) => {
                switch (t) {
                  case 'image':
                    return 'image/*';
                  case 'video':
                    return 'video/*';
                  case 'audio':
                    return 'audio/*';
                  default:
                    return '*/*';
                }
              })
              .join(',')}
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* URL input */}
      {addMode === 'url' && (
        <div
          style={{
            margin: '12px 16px',
            padding: '12px',
            backgroundColor: theme.bgSecondary,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Name (optional)</label>
            <input
              type="text"
              placeholder="My image"
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleUrlAdd}
              disabled={!urlInput.trim()}
              style={{
                ...buttonStyle,
                flex: 1,
                gap: '6px',
                padding: '8px',
                backgroundColor: urlInput.trim()
                  ? theme.primary
                  : theme.bgSecondary,
                color: urlInput.trim() ? '#fff' : theme.textMuted,
                borderColor: urlInput.trim() ? theme.primary : theme.border,
                cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Check style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: '12px' }}>Add</span>
            </button>
            <button
              onClick={() => {
                setAddMode('none');
                setUrlInput('');
                setUrlName('');
              }}
              style={{
                ...buttonStyle,
                padding: '8px',
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}

      {/* Media grid/list */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px 16px',
        }}
      >
        {filteredItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: theme.textMuted,
            }}
          >
            <Image
              style={{
                width: 48,
                height: 48,
                opacity: 0.3,
                marginBottom: '12px',
              }}
            />
            <p style={{ margin: 0, fontSize: '13px' }}>No media items</p>
            <p style={{ margin: '4px 0 0', fontSize: '11px' }}>
              Upload files or add URLs to get started
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '8px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item.id === selectedId ? null : item.id)}
                onDoubleClick={() => openDetailView(item)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border:
                    selectedId === item.id
                      ? `2px solid ${theme.primary}`
                      : `1px solid ${theme.border}`,
                  backgroundColor: theme.bgSecondary,
                }}
              >
                {item.thumbnail ? (
                  <>
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Play icon overlay for videos */}
                    {item.type === 'video' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderLeft: '10px solid #fff',
                            marginLeft: '2px',
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.textMuted,
                    }}
                  >
                    {getTypeIcon(item.type, 24)}
                  </div>
                )}
                {item.isExternal && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      padding: '2px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '4px',
                    }}
                  >
                    <ExternalLink
                      style={{ width: 10, height: 10, color: '#fff' }}
                    />
                  </div>
                )}
                {selectedId === item.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      padding: '2px',
                      backgroundColor: theme.primary,
                      borderRadius: '4px',
                    }}
                  >
                    <Check style={{ width: 10, height: 10, color: '#fff' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item.id === selectedId ? null : item.id)}
                onDoubleClick={() => openDetailView(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedId === item.id ? theme.primaryBg : 'transparent',
                  border:
                    selectedId === item.id
                      ? `1px solid ${theme.primary}`
                      : `1px solid transparent`,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: theme.bgSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {item.thumbnail ? (
                    <>
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Play icon overlay for videos */}
                      {item.type === 'video' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderTop: '4px solid transparent',
                              borderBottom: '4px solid transparent',
                              borderLeft: '6px solid #fff',
                              marginLeft: '1px',
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={{ color: theme.textMuted }}>
                      {getTypeIcon(item.type, 20)}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: theme.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>
                      {item.type}
                    </span>
                    {item.size && <span>• {formatFileSize(item.size)}</span>}
                    {item.width && item.height && (
                      <span>• {item.width}×{item.height}</span>
                    )}
                    {item.isExternal && (
                      <ExternalLink style={{ width: 10, height: 10 }} />
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetailView(item);
                  }}
                  style={{
                    ...buttonStyle,
                    padding: '4px',
                  }}
                  title="Edit"
                >
                  <Edit3 style={{ width: 12, height: 12 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected item actions */}
      {selectedId && selectedItem && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={() => openDetailView(selectedItem)}
            style={{
              ...buttonStyle,
              flex: 1,
              gap: '6px',
              padding: '8px',
            }}
          >
            <Edit3 style={{ width: 14, height: 14 }} />
            <span style={{ fontSize: '12px' }}>Edit</span>
          </button>
          {onInsert && (
            <button
              onClick={() => {
                if (selectedItem) {
                  onInsert(selectedItem);
                }
              }}
              disabled={!selectedItem}
              title={selectedItem ? 'Insert selected media' : 'Select a media item first'}
              style={{
                ...buttonStyle,
                flex: 1,
                gap: '6px',
                padding: '8px',
                backgroundColor: selectedItem ? theme.primary : theme.bgSecondary,
                color: selectedItem ? '#fff' : theme.textMuted,
                borderColor: selectedItem ? theme.primary : theme.border,
                cursor: selectedItem ? 'pointer' : 'not-allowed',
                opacity: selectedItem ? 1 : 0.6,
              }}
            >
              <Check style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: '12px' }}>Insert</span>
            </button>
          )}
          <button
            onClick={() => handleDelete(selectedId)}
            style={{
              ...buttonStyle,
              padding: '8px',
              color: '#ef4444',
            }}
            title="Delete"
          >
            <Trash2 style={{ width: 14, height: 14 }} />
          </button>
        </div>
      )}
    </div>
  );
};
