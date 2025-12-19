import { createComponentProperties, type PropertyField } from '../properties';
import type { StylePropertyDefinition } from '../../../config/style-properties';

const contentFields: PropertyField[] = [
  { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'content' },
  { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description', group: 'content' },
];

export const styleProperties: StylePropertyDefinition[] = [
  { key: 'mediaPlaceholderPadding', label: 'Media Placeholder Padding', type: 'text', group: 'Layout', systemFallback: '40px' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
  src: '',
  alt: '',
  borderRadius: '0',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
