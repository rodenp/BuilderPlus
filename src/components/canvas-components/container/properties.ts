import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [
  {
    key: 'overflow',
    label: 'Scroll Behavior',
    type: 'select',
    defaultValue: 'visible',
    group: 'style',
    options: [
      { label: 'Auto (Scroll)', value: 'auto' },
      { label: 'Visible (Grow)', value: 'visible' },
      { label: 'Hidden (Clip)', value: 'hidden' },
      { label: 'Scroll (Always)', value: 'scroll' },
    ]
  },
];

export const properties = createComponentProperties(contentFields, [], [], true);

export const defaultProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16',
  backgroundColor: 'transparent',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16', right: '16', bottom: '16', left: '16' },
  borderRadius: '0',
};
