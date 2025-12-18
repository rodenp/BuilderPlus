import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const hasBorder = styles.borderWidth && styles.borderWidth !== '0px';
  
  const styleString = [
    `display: ${styles.display || 'flex'}`,
    `flex-direction: ${styles.flexDirection || 'row'}`,
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    `align-items: ${styles.alignItems || 'center'}`,
    `gap: ${styles.gap || '16px'}`,
    styles.width ? `width: ${styles.width}` : '',
    'min-height: 40px',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    `padding-top: ${styles.paddingTop || '8px'}`,
    `padding-right: ${styles.paddingRight || '8px'}`,
    `padding-bottom: ${styles.paddingBottom || '8px'}`,
    `padding-left: ${styles.paddingLeft || '8px'}`,
    `background-color: ${styles.backgroundColor || '#f5f5f5'}`,
    `border: ${hasBorder
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000'}`
      : '1px dashed #cccccc'
    }`,
    `border-radius: ${styles.borderRadius || '4px'}`,
  ].filter(Boolean).join('; ');

  // Default menu items
  const menuItems = `
    <a href="#" style="color: #0066cc; text-decoration: none">Home</a>
    <a href="#" style="color: #0066cc; text-decoration: none">About</a>
    <a href="#" style="color: #0066cc; text-decoration: none">Contact</a>
  `;

  return `<nav style="${styleString}">${menuItems}</nav>`;
};