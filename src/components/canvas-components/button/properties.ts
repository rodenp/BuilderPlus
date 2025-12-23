import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

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

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'buttonFontSize', label: 'Button Font Size', type: 'text', group: 'Typography', systemFallback: '14px' },
  { key: 'buttonFontWeight', label: 'Button Font Weight', type: 'text', group: 'Typography', systemFallback: '500' },
];

export const properties = createComponentProperties(contentFields, [], [], false, {
  padding: { themeKey: 'buttonPadding' },
  backgroundColor: { themeKey: 'buttonPrimaryBg' },
  color: { themeKey: 'buttonPrimaryText' },
  borderRadius: { themeKey: 'buttonBorderRadius' }
});

export const defaultProps = {
  text: 'Button',
  actionType: 'link',
  url: '',
  borderRadius: '8',
  backgroundColor: '#2563eb',
  textColor: '#ffffff',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '12', right: '24', bottom: '12', left: '24' },
};
