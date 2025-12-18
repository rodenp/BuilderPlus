import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const styleString = [
    `height: ${styles.height || (props.height as string) || '32px'}`,
    `background-color: ${styles.backgroundColor || '#f5f5f5'}`,
    `border-radius: ${styles.borderRadius || '4px'}`,
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
  ].filter(Boolean).join('; ');

  return `<div style="${styleString}"></div>`;
};