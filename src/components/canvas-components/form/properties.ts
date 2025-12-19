import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'action', label: 'Form Action', type: 'url', placeholder: '/submit', group: 'content' },
  {
    key: 'method', label: 'Method', type: 'select', defaultValue: 'POST', group: 'content', options: [
      { label: 'POST', value: 'POST' },
      { label: 'GET', value: 'GET' },
    ]
  },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'formPadding', label: 'Form Default Padding', type: 'text', group: 'Layout', systemFallback: '20px' },
];

export const properties = createComponentProperties(contentFields, [], [], true, {
  padding: { themeKey: 'formPadding' }
});

export const defaultProps = {
  action: '',
  method: 'POST',
  display: 'flex',
  flexDirection: 'column',
  gap: '16',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '20', right: '20', bottom: '20', left: '20' },
};
