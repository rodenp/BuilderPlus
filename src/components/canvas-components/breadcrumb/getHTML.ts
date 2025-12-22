import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  const items = (props.items as string[]) || ['Home', 'Category', 'Page'];
  const separator = (props.separator as string) || '/';

  const styleString = [
    'display: flex',
    'align-items: center',
    'gap: 8px',
    styles.width ? `width: ${styles.width}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.paddingTop ? `padding-top: ${styles.paddingTop}` : '',
    styles.paddingRight ? `padding-right: ${styles.paddingRight}` : '',
    styles.paddingBottom ? `padding-bottom: ${styles.paddingBottom}` : '',
    styles.paddingLeft ? `padding-left: ${styles.paddingLeft}` : '',
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
  ].filter(Boolean).join('; ');

  const linkColor = themeStyles.linkColor || '#0066cc';
  const textColor = styles.color || themeStyles.textColor || '#000';

  const breadcrumbHTML = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const linkStyle = `color: ${isLast ? textColor : linkColor}; text-decoration: none; font-size: 14px`;
    const separatorHTML = index < items.length - 1
      ? `<span style="color: ${textColor}; opacity: 0.5">${separator}</span>`
      : '';

    return `<a href="#" style="${linkStyle}">${item}</a>${separatorHTML}`;
  }).join('');

  return `<nav style="${styleString}">${breadcrumbHTML}</nav>`;
};