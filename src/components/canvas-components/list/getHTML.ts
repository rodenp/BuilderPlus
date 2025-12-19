import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const listType = (props.listType as string) || 'unordered';
  const tag = listType === 'ordered' ? 'ol' : 'ul';

  const styleString = [
    'margin: 0',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.paddingTop ? `padding-top: ${styles.paddingTop}` : '',
    styles.paddingRight ? `padding-right: ${styles.paddingRight}` : '',
    styles.paddingBottom ? `padding-bottom: ${styles.paddingBottom}` : '',
    `padding-left: ${styles.paddingLeft || '24px'}`,
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
    `color: ${styles.color || '#000'}`,
    styles.width ? `width: ${styles.width}` : '',
    `list-style-type: ${listType === 'ordered' ? 'decimal' : 'disc'}`,
    styles.display ? `display: ${styles.display}` : '',
    styles.flexDirection ? `flex-direction: ${styles.flexDirection}` : '',
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    styles.alignItems ? `align-items: ${styles.alignItems}` : '',
    styles.gap ? `gap: ${styles.gap}` : '',
  ].filter(Boolean).join('; ');

  // Default items if no children
  const spacing = styles.listItemSpacing || '4px';
  const itemsHTML = `
    <li style="margin-bottom: ${spacing}">Item 1</li>
    <li style="margin-bottom: ${spacing}">Item 2</li>
    <li style="margin-bottom: ${spacing}">Item 3</li>
  `;

  return `<${tag} style="${styleString}">${itemsHTML}</${tag}>`;
};