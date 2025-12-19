import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'thickness', label: 'Thickness', type: 'number', defaultValue: 1, group: 'content' },
  {
    key: 'style', label: 'Style', type: 'select', defaultValue: 'solid', group: 'content', options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
    ]
  },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'dividerColor', label: 'Divider Color', type: 'color', group: 'Colors', systemFallback: 'rgba(0,0,0,0.1)' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  thickness: 1,
  style: 'solid',
  color: '#e5e7eb',
  margin: { top: '16', right: '0', bottom: '16', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
