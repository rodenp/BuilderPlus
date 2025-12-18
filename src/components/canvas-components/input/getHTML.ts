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

  const inputStyle = [
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
  ].filter(Boolean).join('; ');

  const labelHTML = (props.label as string) 
    ? `<label style="display: block; margin-bottom: 4px; font-size: 14px; color: ${styles.color || '#000'}">${props.label}</label>`
    : '';

  const type = (props.type as string) || 'text';
  const placeholder = (props.placeholder as string) || 'Enter text...';

  return `<div style="${wrapperStyle}">${labelHTML}<input type="${type}" placeholder="${placeholder}" style="${inputStyle}" /></div>`;
};