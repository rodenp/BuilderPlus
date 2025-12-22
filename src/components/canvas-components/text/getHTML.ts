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

  const styleString = [
    `color: ${styles.color || themeStyles.textColor || '#171717'}`,
    styles.fontSize ? `font-size: ${styles.fontSize}` : '',
    styles.fontWeight ? `font-weight: ${styles.fontWeight}` : '',
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

  return `<span style="${styleString}">${(props.text as string) || 'Text'}</span>`;
};