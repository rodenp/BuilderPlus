import { createComponentProperties, type PropertyField } from '../properties';

export const contentFields: PropertyField[] = [
    { key: 'date', label: 'Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0], group: 'content' },
    { key: 'showIcon', label: 'Show Icon', type: 'boolean', defaultValue: true, group: 'content' },
];

export const properties = createComponentProperties(contentFields);

export const defaultProps = {
    date: new Date().toISOString().split('T')[0],
    showIcon: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
