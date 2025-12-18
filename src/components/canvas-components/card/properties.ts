import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [];

export const properties = createComponentProperties(contentFields, [], [], true);

export const defaultProps = {
  backgroundColor: '#ffffff',
  borderRadius: '8',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '20', right: '20', bottom: '20', left: '20' },
};
