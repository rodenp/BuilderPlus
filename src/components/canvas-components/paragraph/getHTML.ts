import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);

  const styleString = [
    'font-size: 14px',
    'line-height: 1.6',
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

  const text = (props.text as string) || 'This is a paragraph of text.';
  
  return `<p style="${styleString}">${text}</p>`;
};