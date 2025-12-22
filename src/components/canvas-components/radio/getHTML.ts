import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;

  const wrapperStyle = [
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

  const labelStyle = [
    `color: ${styles.color || themeStyles.labelColor || themeStyles.textColor || '#000'}`,
    'font-size: 14px',
  ].filter(Boolean).join('; ');

  const checked = (props.checked as boolean) || false;
  const label = (props.label as string) || 'Radio label';

  return `<div style="${wrapperStyle}"><input type="radio"${checked ? ' checked' : ''} style="width: 16px; height: 16px" /><label style="${labelStyle}">${label}</label></div>`;
};