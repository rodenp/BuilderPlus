import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'sectionPadding', label: 'Section Default Padding', type: 'text', group: 'Layout', systemFallback: '40px 24px' },
];

export const properties = createComponentProperties(contentFields, [], [], true, {
  padding: { themeKey: 'sectionPadding' }
});

export const defaultProps = {
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '40', right: '24', bottom: '40', left: '24' },
};
