import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';
import { convertToEmbedUrl, isVideoPlatformUrl } from '../../../types/media';

export const getHTML = (component: CanvasComponent, isExport: boolean = true): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);

  // Build style string
  const styleProps = {
    backgroundColor: styles.backgroundColor || `rgba(0,0,0,0.05)`,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : '8px',
    padding: styles.paddingTop ? 
      `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : 
      '40px',
    textAlign: 'center' as const,
    color: styles.color || '#000000',
    width: styles.width || undefined,
    height: styles.height || undefined,
    marginTop: styles.marginTop || undefined,
    marginRight: styles.marginRight || undefined,
    marginBottom: styles.marginBottom || undefined,
    marginLeft: styles.marginLeft || undefined,
    borderWidth: styles.borderWidth || undefined,
    borderStyle: styles.borderStyle || undefined,
    borderColor: styles.borderColor || undefined,
  };

  const styleString = Object.entries(styleProps)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');

  const src = props.src as string;
  const poster = props.poster as string;
  const controls = (props.controls as boolean) !== false;
  const autoplay = (props.autoplay as boolean) || false;
  const muted = (props.muted as boolean) || false;
  const loop = (props.loop as boolean) || false;

  if (src) {
    if (isVideoPlatformUrl(src)) {
      if (isExport) {
        // For exported HTML, show a clickable link since iframes don't work in file:// protocol
        const videoTitle = src.includes('youtube.com') ? 'YouTube Video' : 
                          src.includes('vimeo.com') ? 'Vimeo Video' : 'Video';
        return `<div style="${styleString}">
  <div style="padding: 60px 20px; border: 2px dashed #ccc; border-radius: 8px; background: #f9f9f9;">
    <div style="margin-bottom: 16px;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" style="display: block; margin: 0 auto;">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    </div>
    <h3 style="margin: 0 0 12px; color: #333; font-size: 16px; font-weight: 600;">${videoTitle}</h3>
    <p style="margin: 0 0 20px; color: #666; font-size: 14px;">This video requires a web server to display properly.</p>
    <a href="${src}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #ff0000; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">▶ Watch on ${src.includes('youtube.com') ? 'YouTube' : src.includes('vimeo.com') ? 'Vimeo' : 'Platform'}</a>
    <p style="margin: 16px 0 0; color: #999; font-size: 12px;">Note: To embed this video, upload the HTML file to a web server.</p>
  </div>
</div>`;
      } else {
        // For preview mode, use iframe (works in app)
        const embedUrl = convertToEmbedUrl(src);
        return `<div style="${styleString}">
  <iframe src="${embedUrl}" style="max-width: 100%; width: 100%; height: 315px; border: none; border-radius: inherit;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
      }
    } else {
      // Use video element for direct video files
      const videoAttrs = [
        controls ? 'controls' : '',
        autoplay ? 'autoplay' : '',
        muted ? 'muted' : '',
        loop ? 'loop' : '',
        'playsinline'
      ].filter(Boolean).join(' ');

      const posterAttr = poster ? ` poster="${poster}"` : '';

      return `<div style="${styleString}">
  <video${posterAttr} ${videoAttrs} style="max-width: 100%; height: auto;">
    <source src="${src}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>`;
    }
  } else {
    return `<div style="${styleString}">
  <span style="opacity: 0.5;">Video placeholder</span>
</div>`;
  }
};