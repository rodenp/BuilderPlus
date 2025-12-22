import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Enter text...', group: 'content' },
  { key: 'label', label: 'Label', type: 'text', placeholder: 'Field label', group: 'content' },
  {
    key: 'type', label: 'Input Type', type: 'select', defaultValue: 'text', group: 'content', options: [
      { label: 'Text', value: 'text' },
      { label: 'Email', value: 'email' },
      { label: 'Password', value: 'password' },
      { label: 'Number', value: 'number' },
      { label: 'Tel', value: 'tel' },
    ]
  },
  { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'content' },
];

export const properties = createComponentProperties(contentFields, [], [], false, {
  backgroundColor: { themeKey: 'inputBg' },
  textColor: { themeKey: 'inputTextColor' },
  borderColor: { themeKey: 'inputBorderColor' },
  borderWidth: { themeKey: 'inputBorderWidth' },
  borderStyle: { themeKey: 'inputBorderStyle' },
  borderRadius: { themeKey: 'inputBorderRadius' },
  padding: { themeKey: 'inputPadding' },
});

export const defaultProps = {
  placeholder: 'Enter text...',
  label: '',
  type: 'text',
  required: false,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '8', right: '12', bottom: '8', left: '12' },
  borderRadius: '4',
};
