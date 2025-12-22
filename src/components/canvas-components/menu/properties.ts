import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'items', label: 'Items (one per line)', type: 'textarea', defaultValue: 'Home\nAbout\nContact', group: 'content' },
  {
    key: 'direction', label: 'Direction', type: 'select', defaultValue: 'horizontal', group: 'content', options: [
      { label: 'Horizontal', value: 'horizontal' },
      { label: 'Vertical', value: 'vertical' },
    ]
  },
];

export const properties = createComponentProperties(contentFields, [], [], false, {
  backgroundColor: { themeKey: 'menuBg' },
  color: { themeKey: 'menuTextColor' },
});

export const defaultProps = {
  items: ['Home', 'About', 'Contact'],
  direction: 'horizontal',
  gap: '16',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '8', right: '16', bottom: '8', left: '16' },
};
