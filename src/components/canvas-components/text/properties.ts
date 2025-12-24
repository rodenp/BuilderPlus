import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Text', type: 'text', defaultValue: 'Text', group: 'content' },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'fontSize', label: 'Font Size', type: 'text', group: 'Typography', systemFallback: '16px' },
  { key: 'fontWeight', label: 'Font Weight', type: 'text', group: 'Typography', systemFallback: '400' },
  { key: 'lineHeight', label: 'Line Height', type: 'text', group: 'Typography', systemFallback: '1.5' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Text',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '1.5',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
