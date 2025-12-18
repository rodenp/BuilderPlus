import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Button Text', type: 'text', defaultValue: 'Button', group: 'content' },
  {
    key: 'actionType',
    label: 'Action',
    type: 'select',
    options: [
      { label: 'Open Link', value: 'link' },
      { label: 'Submit Form', value: 'submit' }, // Common in forms
      { label: 'None', value: 'none' },
    ],
    defaultValue: 'link',
    group: 'content'
  },
  { key: 'url', label: 'Link URL', type: 'url', placeholder: 'https://...', group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Button',
  actionType: 'link',
  url: '',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderRadius: '8',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '12', right: '24', bottom: '12', left: '24' },
};
