import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'columns', label: 'Columns', type: 'number', defaultValue: 2, group: 'content' },
  { key: 'gap', label: 'Gap', type: 'number', defaultValue: 16, group: 'content' },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'columnGap', label: 'Column Gap', type: 'text', group: 'Layout', systemFallback: '16px' },
];

export const properties = createComponentProperties(contentFields, [], [], true);

export const defaultProps = {
  columns: 2,
  gap: 16,
  display: 'flex',
  flexDirection: 'row',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
