import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Link Text', type: 'text', defaultValue: 'Link', group: 'content' },
  { key: 'url', label: 'URL', type: 'url', placeholder: 'https://...', group: 'content' },
  {
    key: 'target', label: 'Open In', type: 'select', defaultValue: '_self', group: 'content', options: [
      { label: 'Same Tab', value: '_self' },
      { label: 'New Tab', value: '_blank' },
    ]
  },
];

export const styleProperties: StylePropertyDefinition[] = [
  {
    key: 'linkTextDecoration', label: 'Link Decoration', type: 'select', group: 'Typography', systemFallback: 'underline', options: [
      { label: 'Underline', value: 'underline' },
      { label: 'None', value: 'none' },
    ]
  },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Link',
  url: '#',
  target: '_self',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
