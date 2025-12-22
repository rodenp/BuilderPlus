import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (
  component: CanvasComponent,
  theme: import('../../../types/theme').Theme,
  _renderChildren: (children: CanvasComponent[]) => Promise<string[]>,
  _isExport: boolean = true
): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  const level = (props.level as string) || 'h2';

  // Resolve font size: Prop override > Component specific prop > Theme specific > Default
  const fontSize = styles.fontSize ||
    styles[`${level}FontSize` as string] ||
    themeStyles[`${level}FontSize` as string] ||
    '24px';

  const styleString = [
    `font-size: ${fontSize}`,
    `font-weight: ${styles.headingFontWeight || themeStyles[`${level}FontWeight` as string] || 600}`,
    `color: ${styles.color || themeStyles[`${level}Color` as string] || themeStyles.headingColor || themeStyles.textColor || '#171717'}`,
    `line-height: ${styles.lineHeight || themeStyles[`${level}LineHeight` as string] || 1.2}`,
    'margin: 0',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.paddingTop ? `padding-top: ${styles.paddingTop}` : '',
    styles.paddingRight ? `padding-right: ${styles.paddingRight}` : '',
    styles.paddingBottom ? `padding-bottom: ${styles.paddingBottom}` : '',
    styles.paddingLeft ? `padding-left: ${styles.paddingLeft}` : '',
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
    styles.width ? `width: ${styles.width}` : '',
  ].filter(Boolean).join('; ');

  const text = (props.text as string) || 'Heading';

  return `<${level} style="${styleString}">${text}</${level}>`;
};