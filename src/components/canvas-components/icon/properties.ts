import { createComponentProperties, type PropertyField } from '../properties';

export const contentFields: PropertyField[] = [
  {
    key: 'icon',
    label: 'Icon Name',
    type: 'icon',
    defaultValue: 'Star',
    group: 'content',
    options: [
      { label: 'Music', value: 'Music' },
      { label: 'Menu', value: 'Menu' },
      { label: 'ChevronRight', value: 'ChevronRight' },
      { label: 'Play', value: 'Play' },
    ]
  },
  { key: 'size', label: 'Size', type: 'number', defaultValue: 24, group: 'content' },
];

export const properties = createComponentProperties(
  contentFields,
  [], // Property Groups
  [], // Additional Fields
  true // Include Layout
);

export const defaultProps = {
  icon: 'Star',
  size: 24,
  color: '',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
