import { createComponentProperties, type PropertyField } from '../properties';

export const contentFields: PropertyField[] = [
    { key: 'time', label: 'Time', type: 'time', defaultValue: '12:00', group: 'content' },
    { key: 'showIcon', label: 'Show Icon', type: 'boolean', defaultValue: true, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
    time: '12:00 PM',
    showIcon: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
