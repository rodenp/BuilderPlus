import type { CanvasComponent } from '../../types/component-types';
import type { Theme as UITheme } from '../panels/property-panel/theme';
import type { Theme } from '../../types/theme';

// Canvas theme colors
export interface CanvasTheme {
  bg: string;
  text: string;
  link: string;
  primary: string;
}

// Common styles extracted from component props
export interface CommonStyles {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  display?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  fontSize?: string;
  lineHeight?: string;
  // Dynamic properties from the theme system
  [key: string]: any;
}

// Props passed to each canvas component renderer
export interface CanvasComponentProps {
  component: CanvasComponent;
  canvasTheme: CanvasTheme;
  uiTheme: UITheme;
  activeThemeObject?: Theme;
  commonStyles: CommonStyles;
  isPreviewMode?: boolean;
  // For container components that can have children
  selectedComponentId?: string | null;
  onSelectComponent?: (id: string) => void;
  renderChild?: (child: CanvasComponent) => React.ReactNode;
  builderContext?: any;
}

// Component registration interface
export interface ComponentRegistration {
  type: string;
  render: React.FC<CanvasComponentProps>;
}

// Helper to extract common styles from component props
export const extractCommonStyles = (props: Record<string, unknown>): CommonStyles => {
  const margin = props.margin as { top?: string; right?: string; bottom?: string; left?: string } | undefined;
  const padding = props.padding as { top?: string; right?: string; bottom?: string; left?: string } | undefined;

  // Start with all props (which includes theme defaults)
  const styles: any = { ...props };

  // Explicit transformations for standard layout/spacing
  styles.width = props.width ? (typeof props.width === 'number' || !isNaN(Number(props.width)) ? `${props.width}px` : props.width as string) : undefined;
  styles.height = props.height ? (typeof props.height === 'number' || !isNaN(Number(props.height)) ? `${props.height}px` : props.height as string) : undefined;
  styles.maxWidth = props.maxWidth ? (typeof props.maxWidth === 'number' || !isNaN(Number(props.maxWidth)) ? `${props.maxWidth}px` : props.maxWidth as string) : undefined;
  styles.maxHeight = props.maxHeight ? (typeof props.maxHeight === 'number' || !isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight as string) : undefined;
  styles.backgroundColor = props.backgroundColor as string | undefined;
  styles.color = (props.textColor || props.color) as string | undefined;
  styles.borderRadius = props.borderRadius !== undefined ? (typeof props.borderRadius === 'number' || !isNaN(Number(props.borderRadius)) ? `${props.borderRadius}px` : props.borderRadius as string) : undefined;
  styles.borderWidth = props.borderWidth !== undefined ? (typeof props.borderWidth === 'number' || !isNaN(Number(props.borderWidth)) ? `${props.borderWidth}px` : props.borderWidth as string) : undefined;
  styles.borderStyle = props.borderStyle as string | undefined;
  styles.borderColor = props.borderColor as string | undefined;
  styles.marginTop = margin?.top ? `${margin.top}px` : undefined;
  styles.marginRight = margin?.right ? `${margin.right}px` : undefined;
  styles.marginBottom = margin?.bottom ? `${margin.bottom}px` : undefined;
  styles.marginLeft = margin?.left ? `${margin.left}px` : undefined;
  styles.paddingTop = padding?.top ? `${padding.top}px` : undefined;
  styles.paddingRight = padding?.right ? `${padding.right}px` : undefined;
  styles.paddingBottom = padding?.bottom ? `${padding.bottom}px` : undefined;
  styles.paddingLeft = padding?.left ? `${padding.left}px` : undefined;
  styles.display = props.display as string | undefined;
  styles.gap = props.gap !== undefined ? (typeof props.gap === 'number' || !isNaN(Number(props.gap)) ? `${props.gap}px` : props.gap as string) : undefined;

  return styles as CommonStyles;
};
