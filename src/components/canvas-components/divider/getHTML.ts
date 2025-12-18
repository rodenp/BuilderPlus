import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const styleString = [
    'border: none',
    `border-top: ${(props.thickness as string) || '1px'} solid ${(props.color as string) || 'rgba(0,0,0,0.3)'}`,
    `margin-top: ${styles.marginTop || '16px'}`,
    `margin-bottom: ${styles.marginBottom || '16px'}`,
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.width ? `width: ${styles.width}` : '',
  ].filter(Boolean).join('; ');

  return `<hr style="${styleString}">`;
};