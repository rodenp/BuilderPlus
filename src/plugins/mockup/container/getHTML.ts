import type { CanvasComponent } from '../../../types/component-types';
import { extractCommonStyles } from '../../../components/canvas-components/types';
import { getComponentHTML } from '../../../components/canvas-components/register'; // Recursive call helper

export const getHTML = async (component: CanvasComponent): Promise<string> => {
  const { props, children = [] } = component;
  const styles = extractCommonStyles(props);

  const styleString = [
    'display: flex',
    'flex-direction: column',
    'border: 1px solid #e2e8f0',
    'border-radius: 8px',
    'overflow: hidden',
    styles.width ? `width: ${styles.width}` : '',
    styles.height ? `height: ${styles.height}` : '',
    styles.backgroundColor ? `background-color: ${styles.backgroundColor}` : '',
  ].filter(Boolean).join('; ');

  const childHTMLs = await Promise.all(children.map(child => getComponentHTML(child)));

  return `
    <div class="${component.type}" style="${styleString}">
      <div class="mockup-header" style="background: #f1f5f9; padding: 8px; font-weight: 600;">
        ${props.title || 'Untitled'}
      </div>
      <div class="mockup-content" style="display: flex; flexDirection: column;">
        ${childHTMLs.join('')}
      </div>
    </div>
  `;
};
