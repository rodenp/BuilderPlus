import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Quote Text', type: 'textarea', defaultValue: 'Quote text goes here...', group: 'content' },
  { key: 'author', label: 'Author', type: 'text', placeholder: 'Author name', group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Quote text goes here...',
  author: '',
  borderColor: '#e5e7eb',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16', right: '16', bottom: '16', left: '24' },
};
