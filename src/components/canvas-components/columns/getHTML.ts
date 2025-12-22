import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../types';

export const getHTML = async (
  component: CanvasComponent,
  _theme: import('../../../types/theme').Theme,
  renderChildren: (children: CanvasComponent[]) => Promise<string[]>
): Promise<string> => {
  const { props, children } = component;
  const styles = extractCommonStyles(props);
  // Unused themeStyles removed or kept if needed for fallback
  // const themeStyles = theme.styles; 

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

  const childrenHTML = (await renderChildren(children || [])).join('');
  return `<div style="${styleString}">${childrenHTML}</div>`;
};