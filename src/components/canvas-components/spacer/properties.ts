import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'height', label: 'Height', type: 'number', defaultValue: 24, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  height: 24,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
