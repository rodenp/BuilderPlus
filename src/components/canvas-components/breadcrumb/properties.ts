import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'items', label: 'Items (one per line)', type: 'textarea', defaultValue: 'Home\nCategory\nPage', group: 'content' },
  { key: 'separator', label: 'Separator', type: 'text', defaultValue: '/', group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  items: ['Home', 'Category', 'Page'],
  separator: '/',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
