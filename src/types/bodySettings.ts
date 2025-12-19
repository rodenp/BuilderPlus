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

export type PropertyFieldType = 'text' | 'color' | 'select' | 'number' | 'boolean' | 'spacing';

import type { Theme } from './theme';

export interface BodySettings {
  pageTitle: string;
  metaDescription: string;
  faviconUrl: string;
  activeCanvasThemeId: string;
  activeUIThemeId: string;
  customThemes: Theme[];
  // Page/Global level overrides that sit on top of the active theme
  styleOverrides?: GlobalStyles;
}

export const defaultBodySettings: BodySettings = {
  pageTitle: '',
  metaDescription: '',
  faviconUrl: '',
  activeCanvasThemeId: 'light',
  activeUIThemeId: 'dark',
  customThemes: [],
  styleOverrides: {}
};

/**
 * Migrates legacy body settings to the new theme architecture
 */
export function migrateBodySettings(settings: any): BodySettings {
  // If it's already in the new format, return it
  if (settings && settings.activeCanvasThemeId) {
    if (!settings.styleOverrides) {
      return { ...settings, styleOverrides: {} };
    }
    return settings as BodySettings;
  }

  const migrated: BodySettings = {
    pageTitle: settings?.pageTitle || '',
    metaDescription: settings?.metaDescription || '',
    faviconUrl: settings?.faviconUrl || '',
    activeCanvasThemeId: settings?.defaultMode === 'dark' ? 'dark' : 'light',
    activeUIThemeId: 'dark', // Default UI to dark
    customThemes: [],
    styleOverrides: {}
  };

  // If legacy themes exist, we could optionally convert them to custom themes 
  // if they differ from system defaults, but for simplicity we'll just 
  // point to the system 'light'/'dark' IDs which we've redefined in ThemeRegistry.

  return migrated;
}
