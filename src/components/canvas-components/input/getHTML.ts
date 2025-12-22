import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (
  component: CanvasComponent,
  theme: import('../../../types/theme').Theme,
  _renderChildren: (children: CanvasComponent[]) => Promise<string[]>,
  _isExport: boolean = true
): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;

  const wrapperStyle = [
    styles.width ? `width: ${styles.width}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
  ].filter(Boolean).join('; ');

  const inputStyle = [
    'width: 100%',
    `padding: ${styles.paddingTop
      ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`
      : themeStyles.inputPadding || '8px 12px'
    }`,
    `border: ${styles.borderWidth
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || themeStyles.borderColor || '#000'}`
      : `${themeStyles.inputBorderWidth || '1px'} ${themeStyles.inputBorderStyle || 'solid'} ${themeStyles.inputBorderColor || '#e5e5e5'}`
    }`,
    `border-radius: ${styles.borderRadius || themeStyles.inputBorderRadius || '4px'}`,
    'font-size: 14px',
    `background-color: ${styles.backgroundColor || themeStyles.inputBg || 'transparent'}`,
    `color: ${styles.color || themeStyles.inputTextColor || '#171717'}`,
  ].filter(Boolean).join('; ');

  const labelHTML = (props.label as string)
    ? `<label style="display: block; margin-bottom: 4px; font-size: 14px; color: ${styles.color || themeStyles.labelColor || themeStyles.textColor || '#000'}">${props.label}</label>`
    : '';

  const type = (props.type as string) || 'text';
  const placeholder = (props.placeholder as string) || 'Enter text...';
  const value = (props.value as string) ? `value="${props.value}"` : '';

  return `<div style="${wrapperStyle}">${labelHTML}<input type="${type}" placeholder="${placeholder}" ${value} style="${inputStyle}" /></div>`;
};