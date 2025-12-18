import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const styleString = [
    'display: inline-block',
    styles.paddingTop 
      ? `padding: ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`
      : 'padding: 12px 24px',
    `background-color: ${styles.backgroundColor || '#2563eb'}`,
    `color: ${styles.color || (props.textColor as string) || '#ffffff'}`,
    styles.borderWidth
      ? `border: ${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000'}`
      : 'border: none',
    `border-radius: ${styles.borderRadius || '8px'}`,
    'cursor: pointer',
    'font-size: 14px',
    'font-weight: 500',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
  ].filter(Boolean).join('; ');

  return `<button style="${styleString}">${(props.text as string) || 'Button'}</button>`;
};