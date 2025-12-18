import type { CanvasComponent } from '../../../types/component-types';
// import { extractCommonStyles } from '../../../components/canvas-components/types';

export const getHTML = (component: CanvasComponent): string => {
    const { props } = component;

    const styleString = [
        'padding: 8px',
        'border-radius: 4px',
        'background: white',
        'box-shadow: 0 1px 2px rgba(0,0,0,0.05)',
        'display: flex',
        'align-items: center',
        'gap: 8px',
        `background: ${props.backgroundColor}`,
        `color: ${props.textColor || props.color}`,
        `border-radius: ${props.borderRadius}px`,
    ].filter(Boolean).join('; ');

    let content = '';
    if (props.title) content += `<strong>${props.title}</strong>`;
    if (props.text) content += `<span>${props.text}</span>`;
    if (props.duration) content += `<span style="margin-left: auto; color: #64748b; font-size: 0.8em;">${props.duration}</span>`;

    return `<div class="mockup-item" style="${styleString}">${content}</div>`;
};
