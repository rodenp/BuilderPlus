import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;

  const containerStyles = [
    `background-color: ${styles.backgroundColor || themeStyles.cardBg || 'rgba(0,0,0,0.05)'}`,
    `border-radius: ${styles.borderRadius || themeStyles.borderRadius || '8px'}`,
    styles.paddingTop ? `padding: ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : `padding: ${styles.mediaPlaceholderPadding || '40px'}`,
    'text-align: center',
    `color: ${styles.color || themeStyles.textColor || '#000'}`,
    styles.width ? `width: ${styles.width}` : '',
    styles.height ? `height: ${styles.height}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.borderWidth ? `border: ${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || themeStyles.borderColor || '#000'}` : '',
  ].filter(Boolean).join('; ');

  const content = (props.src as string)
    ? `<img src="${props.src}" alt="${(props.alt as string) || 'Image'}" style="max-width: 100%; height: auto;">`
    : '<span style="opacity: 0.5;">Image placeholder</span>';

  return `<div style="${containerStyles}">${content}</div>`;
};