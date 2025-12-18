import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const level = (props.level as string) || 'h2';
  
  const fontSizes: Record<string, string> = {
    h1: '36px',
    h2: '30px',
    h3: '24px',
    h4: '20px',
    h5: '18px',
    h6: '16px',
  };

  const styleString = [
    `font-size: ${fontSizes[level] || '24px'}`,
    'font-weight: 600',
    styles.color ? `color: ${styles.color}` : '',
    'margin: 0',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.paddingTop ? `padding-top: ${styles.paddingTop}` : '',
    styles.paddingRight ? `padding-right: ${styles.paddingRight}` : '',
    styles.paddingBottom ? `padding-bottom: ${styles.paddingBottom}` : '',
    styles.paddingLeft ? `padding-left: ${styles.paddingLeft}` : '',
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
    styles.width ? `width: ${styles.width}` : '',
  ].filter(Boolean).join('; ');

  const text = (props.text as string) || 'Heading';
  
  return `<${level} style="${styleString}">${text}</${level}>`;
};