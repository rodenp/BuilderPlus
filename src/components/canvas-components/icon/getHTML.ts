import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  // const iconName = (props.icon as string) || 'Star'; // Not used in HTML export
  const size = parseInt((props.size as string) || '24', 10);

  const styleString = [
    'display: inline-flex',
    'align-items: center',
    'justify-content: center',
    `color: ${(props.color as string) || styles.color || themeStyles.textColor || '#000'}`,
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
    styles.width ? `width: ${styles.width}` : '',
    styles.height ? `height: ${styles.height}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.paddingTop ? `padding-top: ${styles.paddingTop}` : '',
    styles.paddingRight ? `padding-right: ${styles.paddingRight}` : '',
    styles.paddingBottom ? `padding-bottom: ${styles.paddingBottom}` : '',
    styles.paddingLeft ? `padding-left: ${styles.paddingLeft}` : '',
  ].filter(Boolean).join('; ');

  // For HTML export, we'll use a simple fallback since we can't use React icons
  // This could be enhanced to use icon fonts or SVG in the future
  const iconHTML = `<span style="font-size: ${size}px; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center">★</span>`;

  return `<div style="${styleString}">${iconHTML}</div>`;
};