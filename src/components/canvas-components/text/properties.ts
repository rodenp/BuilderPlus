import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Text', type: 'text', defaultValue: 'Text', group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Text',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
