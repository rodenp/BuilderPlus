import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent, theme: import('../../../types/theme').Theme): string => {
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

  const selectStyle = [
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

  const placeholder = (props.placeholder as string) || 'Select an option';
  const options = (props.options as string[]) || ['Option 1', 'Option 2', 'Option 3'];

  const optionsHTML = [
    `<option value="">${placeholder}</option>`,
    ...options.map(opt => `<option value="${opt}">${opt}</option>`)
  ].join('');

  return `<div style="${wrapperStyle}">${labelHTML}<select style="${selectStyle}">${optionsHTML}</select></div>`;
};