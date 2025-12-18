import { createComponentProperties, type PropertyField } from '../properties';

export const contentFields: PropertyField[] = [
    { key: 'duration', label: 'Duration', type: 'duration', defaultValue: '00:00:00', group: 'content' },
    { key: 'showIcon', label: 'Show Icon', type: 'boolean', defaultValue: true, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
    duration: '00:05:00',
    showIcon: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
