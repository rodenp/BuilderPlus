// Comprehensive repository of global style defaults
export interface GlobalStyles {
  // Layout & Box Model
  display?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  margin?: string;
  padding?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  zIndex?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;

  // Flexbox & Grid
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  order?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;

  // Typography (Generic)
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  whiteSpace?: string;
  wordBreak?: string;

  // Borders & Outlines
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  outline?: string;
  outlineOffset?: string;

  // Backgrounds & Visuals
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  opacity?: string;
  boxShadow?: string;
  cursor?: string;
  visibility?: string;
  backdropFilter?: string;
  filter?: string;

  // Transforms & Transitions
  transform?: string;
  transformOrigin?: string;
  transition?: string;
  transitionDuration?: string;
  transitionProperty?: string;
  transitionTimingFunction?: string;

  [key: string]: string | number | null | undefined;
}

// Default colors based on canvas dark/light mode
export const getDefaultCanvasColors = (isCanvasDark: boolean) => ({
  backgroundColor: isCanvasDark ? '#1e1e1e' : '#ffffff',
  textColor: isCanvasDark ? '#e5e5e5' : '#171717',
  linkColor: isCanvasDark ? '#60a5fa' : '#2563eb',
});

export interface BodySettings {
  pageTitle: string;
  metaDescription: string;
  faviconUrl: string;
  theme: {
    light: GlobalStyles;
    dark: GlobalStyles;
  };
  defaultMode: 'light' | 'dark' | 'system';
}

export const defaultBodySettings: BodySettings = {
  pageTitle: '',
  metaDescription: '',
  faviconUrl: '',
  defaultMode: 'system',
  theme: {
    light: {
      backgroundColor: '#ffffff',
      textColor: '#171717',
      linkColor: '#2563eb',
      primaryColor: '#2563eb',
      fontFamily: 'Inter',
      fontSize: '16px',
      lineHeight: '1.5',
      maxWidth: '1200px',
      padding: '20px',
    },
    dark: {
      backgroundColor: '#1e1e1e',
      textColor: '#e5e5e5',
      linkColor: '#60a5fa',
      primaryColor: '#3b82f6',
      fontFamily: 'Inter',
      fontSize: '16px',
      lineHeight: '1.5',
      maxWidth: '1200px',
      padding: '20px',
    }
  }
};
