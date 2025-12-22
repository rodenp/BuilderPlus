import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  const hasBorder = styles.borderWidth && styles.borderWidth !== '0px';

  const styleString = [
    `display: ${styles.display || 'flex'}`,
    `flex-direction: ${styles.flexDirection || 'row'}`,
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    `align-items: ${styles.alignItems || 'center'}`,
    `gap: ${styles.gap || '16px'}`,
    styles.width ? `width: ${styles.width}` : '',
    'min-height: 40px',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    `padding-top: ${styles.paddingTop || '8px'}`,
    `padding-right: ${styles.paddingRight || '8px'}`,
    `padding-bottom: ${styles.paddingBottom || '8px'}`,
    `padding-left: ${styles.paddingLeft || '8px'}`,
    `background-color: ${styles.backgroundColor || themeStyles.menuBg || 'transparent'}`,
    `border: ${hasBorder
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || themeStyles.borderColor || '#000'}`
      : 'none'
    }`,
    `border-radius: ${styles.borderRadius || '4px'}`,
    `color: ${styles.color || themeStyles.menuTextColor || themeStyles.textColor || '#171717'}`,
  ].filter(Boolean).join('; ');

  const linkColor = themeStyles.menuLinkColor || themeStyles.linkColor || '#2563eb';

  // Default menu items
  const menuItems = (props.items as string[] || ['Home', 'About', 'Contact']).map(item =>
    `<a href="#" style="color: ${linkColor}; text-decoration: none; padding: 0 8px;">${item}</a>`
  ).join('');

  return `<nav style="${styleString}">${menuItems}</nav>`;
};