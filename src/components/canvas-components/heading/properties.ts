import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Text', type: 'text', defaultValue: 'Heading', group: 'content' },
  {
    key: 'level', label: 'Level', type: 'select', defaultValue: 'h2', group: 'content', options: [
      { label: 'H1', value: 'h1' },
      { label: 'H2', value: 'h2' },
      { label: 'H3', value: 'h3' },
      { label: 'H4', value: 'h4' },
      { label: 'H5', value: 'h5' },
      { label: 'H6', value: 'h6' },
    ]
  },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'headingFontWeight', label: 'Heading Font Weight', type: 'text', group: 'Typography', systemFallback: '600' },
  { key: 'h1FontSize', label: 'H1 Size', type: 'text', group: 'Typography', systemFallback: '36px' },
  { key: 'h2FontSize', label: 'H2 Size', type: 'text', group: 'Typography', systemFallback: '30px' },
  { key: 'h3FontSize', label: 'H3 Size', type: 'text', group: 'Typography', systemFallback: '24px' },
  { key: 'h4FontSize', label: 'H4 Size', type: 'text', group: 'Typography', systemFallback: '20px' },
  { key: 'h5FontSize', label: 'H5 Size', type: 'text', group: 'Typography', systemFallback: '18px' },
  { key: 'h6FontSize', label: 'H6 Size', type: 'text', group: 'Typography', systemFallback: '16px' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Heading',
  level: 'h2',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
