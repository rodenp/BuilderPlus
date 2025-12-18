import type { PropertyField } from '../../../components/canvas-components/properties';
import {
    baseSpacingFields,
    baseSizeFields,
    baseBorderFields
} from '../../../components/canvas-components/properties';

export const properties: PropertyField[] = [
    { key: 'title', label: 'Title', type: 'text', group: 'content' },
    { key: 'type', label: 'Type', type: 'text', group: 'content' },
    { key: 'text', label: 'Text (Alt)', type: 'text', group: 'content' },
    { key: 'duration', label: 'Duration', type: 'text', group: 'content' },
    { key: 'checked', label: 'Checked', type: 'boolean', group: 'content' },
    { key: 'icon', label: 'Icon Name', type: 'text', group: 'content' },
    { key: 'emoji', label: 'Emoji', type: 'text', group: 'content' },
    // { key: 'color', label: 'Accent Color', type: 'color', group: 'content' }, // Removed in favor of standard colors
    ...baseSpacingFields,
    ...baseSizeFields,
    ...baseBorderFields,
    // ...baseColorFields // This includes backgroundColor and color (Text Color)
    { key: 'backgroundColor', label: 'Background', type: 'color', group: 'colors' },
    { key: 'color', label: 'Text Color', type: 'color', group: 'colors' }
];

export const defaultProps = {
    title: 'New Item',
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
    gap: 0,
    borderRadius: 4,
    backgroundColor: '#0f172a', // var(--mockup-bg-primary)
    textColor: '#f8fafc' // var(--mockup-text-primary)
};
