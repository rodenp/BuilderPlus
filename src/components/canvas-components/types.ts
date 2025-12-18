import type { CanvasComponent } from '../../types/component-types';
import type { Theme } from '../panels/property-panel/theme';

// Canvas theme colors
export interface CanvasTheme {
  bg: string;
  text: string;
  link: string;
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
}

// Props passed to each canvas component renderer
export interface CanvasComponentProps {
  component: CanvasComponent;
  canvasTheme: CanvasTheme;
  uiTheme: Theme;
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

  return {
    width: props.width ? (typeof props.width === 'number' || !isNaN(Number(props.width)) ? `${props.width}px` : props.width as string) : undefined,
    height: props.height ? (typeof props.height === 'number' || !isNaN(Number(props.height)) ? `${props.height}px` : props.height as string) : undefined,
    maxWidth: props.maxWidth ? (typeof props.maxWidth === 'number' || !isNaN(Number(props.maxWidth)) ? `${props.maxWidth}px` : props.maxWidth as string) : undefined,
    maxHeight: props.maxHeight ? (typeof props.maxHeight === 'number' || !isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight as string) : undefined,
    backgroundColor: props.backgroundColor as string | undefined,
    color: (props.textColor || props.color) as string | undefined,
    borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
    borderWidth: props.borderWidth !== undefined ? (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth as string) : undefined,
    borderStyle: props.borderStyle as string | undefined,
    borderColor: props.borderColor as string | undefined,
    marginTop: margin?.top ? `${margin.top}px` : undefined,
    marginRight: margin?.right ? `${margin.right}px` : undefined,
    marginBottom: margin?.bottom ? `${margin.bottom}px` : undefined,
    marginLeft: margin?.left ? `${margin.left}px` : undefined,
    paddingTop: padding?.top ? `${padding.top}px` : undefined,
    paddingRight: padding?.right ? `${padding.right}px` : undefined,
    paddingBottom: padding?.bottom ? `${padding.bottom}px` : undefined,
    paddingLeft: padding?.left ? `${padding.left}px` : undefined,
    display: props.display as string | undefined,
    flexDirection: props.flexDirection as CommonStyles['flexDirection'],
    flexWrap: props.flexWrap as CommonStyles['flexWrap'],
    justifyContent: props.justifyContent as string | undefined,
    alignItems: props.alignItems as string | undefined,
    gap: props.gap !== undefined ? `${props.gap}px` : undefined,
  };
};
