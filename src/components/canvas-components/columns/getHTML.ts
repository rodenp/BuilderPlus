import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const columns = (props.columns as number) || 2;
  const gap = styles.columnGap || (props.gap as string) || '16px';

  const styleString = [
    'display: grid',
    `grid-template-columns: repeat(${columns}, 1fr)`,
    `gap: ${gap}`,
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

  // Generate column divs
  const columnDivs = Array.from({ length: columns }, (_, i) =>
    `<div style="min-height: 60px; border: 1px dashed #cccccc; border-radius: 4px; padding: 16px; display: flex; align-items: center; justify-content: center; color: #666; opacity: 0.5; font-size: 12px">Column ${i + 1}</div>`
  ).join('');

  return `<div style="${styleString}">${columnDivs}</div>`;
};