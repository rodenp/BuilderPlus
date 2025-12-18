import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Checkbox label', group: 'content' },
  { key: 'checked', label: 'Checked', type: 'boolean', defaultValue: false, group: 'content' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  label: 'Checkbox label',
  checked: false,
  disabled: false,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
