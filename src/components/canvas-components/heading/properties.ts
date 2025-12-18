import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Text', type: 'text', defaultValue: 'Heading', group: 'content' },
  { key: 'level', label: 'Level', type: 'select', defaultValue: 'h2', group: 'content', options: [
    { label: 'H1', value: 'h1' },
    { label: 'H2', value: 'h2' },
    { label: 'H3', value: 'h3' },
    { label: 'H4', value: 'h4' },
    { label: 'H5', value: 'h5' },
    { label: 'H6', value: 'h6' },
  ]},
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Heading',
  level: 'h2',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
