import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Radio option', group: 'content' },
  { key: 'name', label: 'Group Name', type: 'text', defaultValue: 'radio-group', group: 'content' },
  { key: 'checked', label: 'Selected', type: 'boolean', defaultValue: false, group: 'content' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  label: 'Radio option',
  name: 'radio-group',
  checked: false,
  disabled: false,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
