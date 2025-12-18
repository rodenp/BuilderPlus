import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const styleString = [
    `padding: ${styles.paddingTop ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : '40px 24px'}`,
    `background-color: ${styles.backgroundColor || 'transparent'}`,
    `min-height: 100px`,
    styles.width ? `width: ${styles.width}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.borderWidth ? `border-width: ${styles.borderWidth}` : '',
    styles.borderStyle ? `border-style: ${styles.borderStyle}` : '',
    styles.borderColor ? `border-color: ${styles.borderColor}` : '',
    styles.borderRadius ? `border-radius: ${styles.borderRadius}` : '',
    styles.display ? `display: ${styles.display}` : '',
    styles.flexDirection ? `flex-direction: ${styles.flexDirection}` : '',
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    styles.alignItems ? `align-items: ${styles.alignItems}` : '',
    styles.gap ? `gap: ${styles.gap}` : '',
  ].filter(Boolean).join('; ');

  return `<section style="${styleString}">Section</section>`;
};