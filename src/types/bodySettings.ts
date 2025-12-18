export interface BodySettings {
  // Background
  backgroundColor: string | null;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;

  // Typography
  fontFamily: string;
  baseFontSize: string;
  baseLineHeight: string;
  textColor: string | null;
  linkColor: string | null;

  // Layout
  contentWidth: string;
  contentPadding: string;

  // Meta
  pageTitle: string;
  metaDescription: string;
  faviconUrl: string;
}

export const defaultBodySettings: BodySettings = {
  backgroundColor: null,
  backgroundImage: '',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  fontFamily: 'Inter',
  baseFontSize: '16',
  baseLineHeight: '1.5',
  textColor: null,
  linkColor: null,
  contentWidth: '1200',
  contentPadding: '20',
  pageTitle: '',
  metaDescription: '',
  faviconUrl: '',
};

// Default colors based on canvas dark/light mode
export const getDefaultCanvasColors = (isCanvasDark: boolean) => ({
  backgroundColor: isCanvasDark ? '#1e1e1e' : '#ffffff',
  textColor: isCanvasDark ? '#e5e5e5' : '#171717',
  linkColor: isCanvasDark ? '#60a5fa' : '#2563eb',
});
