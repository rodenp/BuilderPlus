import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;

  const styleString = [
    'display: inline-block',
    styles.paddingTop
      ? `padding: ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`
      : `padding: ${themeStyles.buttonPadding || '12px 24px'}`,
    `background-color: ${styles.backgroundColor || themeStyles.buttonPrimaryBg || '#2563eb'}`,
    `color: ${styles.color || (props.textColor as string) || themeStyles.buttonPrimaryText || '#ffffff'}`,
    styles.borderWidth
      ? `border: ${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000'}`
      : 'border: none',
    `border-radius: ${styles.borderRadius || themeStyles.buttonBorderRadius || '4px'}`,
    'cursor: pointer',
    `font-size: ${styles.buttonFontSize || '14px'}`,
    `font-weight: ${styles.buttonFontWeight || 500}`,
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
  ].filter(Boolean).join('; ');

  return `<button style="${styleString}">${(props.text as string) || 'Button'}</button>`;
};