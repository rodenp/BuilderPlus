import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const wrapperStyle = [
    styles.width ? `width: ${styles.width}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
  ].filter(Boolean).join('; ');

  const textareaStyle = [
    'width: 100%',
    `padding: ${styles.paddingTop
      ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`
      : '8px 12px'
    }`,
    `border: ${styles.borderWidth
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000'}`
      : '1px solid #cccccc'
    }`,
    `border-radius: ${styles.borderRadius || '4px'}`,
    'font-size: 14px',
    `background-color: ${styles.backgroundColor || 'transparent'}`,
    `color: ${styles.color || '#000'}`,
    'resize: vertical',
  ].filter(Boolean).join('; ');

  const labelHTML = (props.label as string) 
    ? `<label style="display: block; margin-bottom: 4px; font-size: 14px; color: ${styles.color || '#000'}">${props.label}</label>`
    : '';

  const placeholder = (props.placeholder as string) || 'Enter text...';
  const rows = (props.rows as number) || 4;

  return `<div style="${wrapperStyle}">${labelHTML}<textarea placeholder="${placeholder}" rows="${rows}" style="${textareaStyle}"></textarea></div>`;
};