import type { PropertyField } from '../../../components/canvas-components/properties';
import {
    baseSpacingFields,
    baseSizeFields,
    baseBorderFields,
    baseColorFields,
    baseLayoutFields
} from '../../../components/canvas-components/properties';

export const properties: PropertyField[] = [
    { key: 'title', label: 'Title', type: 'text', group: 'content' },
    { key: 'type', label: 'Type Tag', type: 'text', group: 'content' },
    { key: 'count', label: 'Count Badge', type: 'number', group: 'content' },
    ...baseLayoutFields,
    ...baseSpacingFields,
    ...baseSizeFields,
    ...baseBorderFields,
    ...baseColorFields
];

export const defaultProps = {
    title: 'New Column',
    type: 'list',
    width: '100%',
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
    gap: 0,

    flexDirection: 'column',
    alignItems: 'stretch'
};
