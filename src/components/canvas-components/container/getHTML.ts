import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = async (
  component: CanvasComponent,
  theme: import('../../../types/theme').Theme,
  renderChildren: (children: CanvasComponent[]) => Promise<string[]>,
  isExport: boolean = false
): Promise<string> => {
  const { props, children } = component;
  const styles = extractCommonStyles(props);
  const themeStyles = theme.styles;
  const hasBorder = styles.borderWidth && styles.borderWidth !== '0px';

  const styleString = [
    `padding: ${styles.paddingTop ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : (props.padding as string) || themeStyles.containerPadding || '16px'}`,
    `background-color: ${styles.backgroundColor || themeStyles.containerBg || 'transparent'}`,
    hasBorder
      ? `border: ${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || themeStyles.borderColor || '#000'}`
      : (isExport ? 'border: none' : 'border: 1px dashed #cccccc'),
    `border-radius: ${styles.borderRadius || styles.containerBorderRadius || themeStyles.borderRadius || '4px'}`,
    `min-height: 60px`,
    styles.width ? `width: ${styles.width}` : '',
    styles.height ? `height: ${styles.height}` : '',
    styles.marginTop ? `margin-top: ${styles.marginTop}` : '',
    styles.marginRight ? `margin-right: ${styles.marginRight}` : '',
    styles.marginBottom ? `margin-bottom: ${styles.marginBottom}` : '',
    styles.marginLeft ? `margin-left: ${styles.marginLeft}` : '',
    styles.display ? `display: ${styles.display}` : '',
    styles.flexDirection ? `flex-direction: ${styles.flexDirection}` : '',
    styles.flexWrap ? `flex-wrap: ${styles.flexWrap}` : '',
    styles.justifyContent ? `justify-content: ${styles.justifyContent}` : '',
    styles.alignItems ? `align-items: ${styles.alignItems}` : '',
    styles.gap ? `gap: ${styles.gap}` : '',
  ].filter(Boolean).join('; ');

  const childrenHTML = (await renderChildren(children || [])).join('');
  return `<div style="${styleString}">${childrenHTML}</div>`;
};