import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'items', label: 'Items (one per line)', type: 'textarea', defaultValue: 'Item 1\nItem 2\nItem 3', group: 'content' },
  {
    key: 'listStyle', label: 'List Style', type: 'select', defaultValue: 'disc', group: 'content', options: [
      { label: 'Bullet', value: 'disc' },
      { label: 'Circle', value: 'circle' },
      { label: 'Square', value: 'square' },
      { label: 'Numbered', value: 'decimal' },
      { label: 'None', value: 'none' },
    ]
  },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'listItemSpacing', label: 'Item Spacing', type: 'text', group: 'Layout', systemFallback: '4px' },
];

export const properties = createComponentProperties(contentFields, [], [], true, {
  padding: { themeKey: 'containerPadding' },
  backgroundColor: { themeKey: 'containerBg' }
});

export const defaultProps = {
  items: ['Item 1', 'Item 2', 'Item 3'],
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'row',
  gap: '16',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16', right: '16', bottom: '16', left: '16' },
};
