import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'text', label: 'Text', type: 'textarea', defaultValue: 'Text', group: 'content' },
  { key: 'maxHeight', label: 'Max Height', type: 'text', defaultValue: '', group: 'style' },
  {
    key: 'overflow',
    label: 'Scroll Behavior',
    type: 'select',
    defaultValue: 'auto',
    group: 'style',
    options: [
      { label: 'Auto (Scroll)', value: 'auto' },
      { label: 'Visible (Grow)', value: 'visible' },
      { label: 'Hidden (Clip)', value: 'hidden' },
      { label: 'Scroll (Always)', value: 'scroll' },
    ]
  },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  text: 'Text',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
