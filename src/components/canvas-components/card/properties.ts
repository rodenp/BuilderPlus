import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'cardShadow', label: 'Card Shadow', type: 'text', group: 'Effects', systemFallback: '0 1px 3px rgba(0,0,0,0.1)' },
  { key: 'cardBorderRadius', label: 'Card Corner Radius', type: 'text', group: 'Layout & Spacing', systemFallback: '8px' },
];

export const properties = createComponentProperties(contentFields, [], [], true, {
  padding: { themeKey: 'cardPadding' },
  backgroundColor: { themeKey: 'cardBg' },
  borderRadius: { themeKey: 'cardBorderRadius' }
});

export const defaultProps = {
  backgroundColor: '#ffffff',
  borderRadius: '8',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '20', right: '20', bottom: '20', left: '20' },
};
