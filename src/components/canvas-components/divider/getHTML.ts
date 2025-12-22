import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  const dividerColor = styles.dividerColor || (props.color as string) || themeStyles.borderColor || 'rgba(0,0,0,0.1)';

  const styleString = [
    'border: none',
    `border-top: ${(props.thickness as string) || '1px'} ${(props.style as string) || 'solid'} ${dividerColor}`,
    `margin-top: ${styles.marginTop || '16px'}`,
    `margin-bottom: ${styles.marginBottom || '16px'}`,
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.width ? `width: ${styles.width}` : '',
  ].filter(Boolean).join('; ');

  return `<hr style="${styleString}">`;
};