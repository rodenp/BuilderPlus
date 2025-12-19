import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = (component: CanvasComponent): string => {
  const { props } = component;
  const styles = extractCommonStyles(props);
  const hasBorder = styles.borderWidth && styles.borderWidth !== '0px';

  const styleString = [
    `padding: ${styles.paddingTop ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : (props.padding as string) || '16px'}`,
    `background-color: ${styles.backgroundColor || 'transparent'}`,
    `border: ${hasBorder
      ? `${styles.borderWidth} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000'}`
      : '1px dashed #cccccc'
    }`,
    `border-radius: ${styles.borderRadius || styles.containerBorderRadius || '4px'}`,
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

  return `<div style="${styleString}">Container</div>`;
};