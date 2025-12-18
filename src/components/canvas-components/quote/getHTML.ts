import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  
  const styleString = [
    'margin: 0',
    `margin-top: ${styles.marginTop || '16px'}`,
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    `margin-bottom: ${styles.marginBottom || '16px'}`,
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    `padding-top: ${styles.paddingTop || '12px'}`,
    `padding-right: ${styles.paddingRight || '20px'}`,
    `padding-bottom: ${styles.paddingBottom || '12px'}`,
    `padding-left: ${styles.paddingLeft || '20px'}`,
    `border-left: 4px solid ${(props.borderColor as string) || '#cccccc'}`,
    `background-color: ${styles.backgroundColor || '#f5f5f5'}`,
    `color: ${styles.color || '#000'}`,
    'font-style: italic',
    styles.width ? `width: ${styles.width}` : '',
  ].filter(Boolean).join('; ');

  const text = (props.text as string) || 'This is a quote.';
  const citation = props.citation as string;

  const citationHTML = citation 
    ? `<cite style="display: block; margin-top: 8px; font-size: 14px; opacity: 0.7; font-style: normal">— ${citation}</cite>`
    : '';

  return `<blockquote style="${styleString}"><p style="margin: 0">${text}</p>${citationHTML}</blockquote>`;
};