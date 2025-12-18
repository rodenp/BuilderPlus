import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'items', label: 'Items (one per line)', type: 'textarea', defaultValue: 'Item 1\nItem 2\nItem 3', group: 'content' },
  { key: 'listStyle', label: 'List Style', type: 'select', defaultValue: 'disc', group: 'content', options: [
    { label: 'Bullet', value: 'disc' },
    { label: 'Circle', value: 'circle' },
    { label: 'Square', value: 'square' },
    { label: 'Numbered', value: 'decimal' },
    { label: 'None', value: 'none' },
  ]},
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  items: ['Item 1', 'Item 2', 'Item 3'],
  listStyle: 'disc',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '24' },
};
