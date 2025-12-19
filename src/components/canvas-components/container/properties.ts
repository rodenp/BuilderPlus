import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

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

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'containerBorderRadius', label: 'Container Corner Radius', type: 'text', group: 'Layout & Spacing', systemFallback: '4px' },
];

export const properties = createComponentProperties(contentFields, [], [], true, {
  padding: { themeKey: 'containerPadding' },
  backgroundColor: { themeKey: 'containerBg' }
});

export const defaultProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16',
  backgroundColor: 'transparent',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16', right: '16', bottom: '16', left: '16' },
  borderRadius: '0',
};
