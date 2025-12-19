import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const hasBorder = styles.borderWidth && styles.borderWidth !== '0px';

  const styleString = [
    `padding: ${styles.paddingTop ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : '20px'}`,
    `background-color: ${styles.backgroundColor || '#ffffff'}`,
    `border: ${hasBorder
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#e5e7eb'}`
      : '1px solid #e5e7eb'
    }`,
    `border-radius: ${styles.borderRadius || styles.cardBorderRadius || '8px'}`,
    `box-shadow: ${styles.cardShadow || '0 1px 3px rgba(0,0,0,0.1)'}`,
    `min-height: 80px`,
    styles.width ? `width: ${styles.width}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.display ? `display: ${styles.display}` : '',
    styles.flexDirection ? `flex-direction: ${styles.flexDirection}` : '',
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    styles.alignItems ? `align-items: ${styles.alignItems}` : '',
    styles.gap ? `gap: ${styles.gap}` : '',
  ].filter(Boolean).join('; ');

  return `<div style="${styleString}">Card</div>`;
};