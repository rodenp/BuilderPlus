// Core component types
export type ComponentType =
  | 'columns'
  | 'button'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'social'
  | 'menu'
  | 'html'
  | 'row'
  | 'column';

export type ContainerType = 'columns' | 'row' | 'column' | 'social' | 'menu';

export interface BaseStyles {
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Colors
  backgroundColor?: string;
  color?: string;

  // Border
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;

  // Layout
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;

  // Flexbox (for containers)
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  gap?: string;

  // Other
  opacity?: string;
  boxShadow?: string;
  cursor?: string;
  overflow?: string;
  position?: string;
  zIndex?: string;
}

export interface HTMLAttributes {
  id?: string;
  className?: string;
  title?: string;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaHidden?: boolean;
  dataAttributes?: Record<string, string>;
}

export interface LinkAttributes {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  download?: boolean | string;
}

export interface ImageAttributes {
  src?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  width?: string;
  height?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export interface ButtonAttributes {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  name?: string;
  value?: string;
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  label: string;
  content?: string;
  styles: BaseStyles;
  htmlAttributes: HTMLAttributes;
  specificAttributes?: Record<string, unknown>;
  children?: BuilderComponent[];
  parentId?: string | null;
}

export interface BodySettings {
  styles: BaseStyles;
  htmlAttributes: HTMLAttributes;
  metaTags?: { name: string; content: string }[];
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  text: string;
  textMuted: string;
  background: string;
  surface: string;
  border: string;
}

export interface ThemeSettings {
  name: string;
  flavor: 'professional' | 'classic' | 'modern' | 'playful' | 'minimal';
  lightMode: ThemeColors;
  darkMode: ThemeColors;
  typography: {
    fontFamily: string;
    headingFontFamily: string;
    baseFontSize: string;
    scale: number;
  };
  spacing: {
    unit: number;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface UserBlock {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  components: BuilderComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export type AppMode = 'edit' | 'preview';

export interface ModeState {
  mode: AppMode;
  selectedComponentId: string | null;
  showPropertyPanel: boolean;
  showSideMenu: boolean;
  showComponentToolbars: boolean;
}

export interface BuilderState {
  components: BuilderComponent[];
  selectedComponentId: string | null;
  bodySettings: BodySettings;
  themeSettings: ThemeSettings;
  userBlocks: UserBlock[];
  uiDarkMode: boolean;
  canvasDarkMode: boolean;
  mode: AppMode;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  activeSidePanel: 'content' | 'blocks' | 'body' | 'brand' | null;
}

export interface PropertyGroup {
  id: string;
  label: string;
  icon?: string;
  collapsed?: boolean;
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'navigation' | 'advanced';
  isContainer: boolean;
  acceptsChildren?: ComponentType[];
  defaultProps: Partial<BuilderComponent>;
  propertyGroups: PropertyGroup[];
}
