import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Quote Text', type: 'textarea', defaultValue: 'Quote text goes here...', group: 'content' },
  { key: 'citation', label: 'Citation', type: 'text', placeholder: 'Author name', group: 'content' },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'quoteBorderColor', label: 'Quote Border Color', type: 'color', group: 'Colors', systemFallback: 'rgba(0,0,0,0.1)' },
  { key: 'quoteBg', label: 'Quote Background', type: 'color', group: 'Colors', systemFallback: 'rgba(0,0,0,0.02)' },
  {
    key: 'quoteFontStyle', label: 'Quote Font Style', type: 'select', group: 'Typography', systemFallback: 'italic', options: [
      { label: 'Italic', value: 'italic' },
      { label: 'Normal', value: 'normal' },
    ]
  },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Quote text goes here...',
  citation: '',
  borderColor: '#e5e7eb',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16', right: '16', bottom: '16', left: '24' },
};
