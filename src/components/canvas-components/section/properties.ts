import { createComponentProperties, type PropertyField } from '../properties';

const contentFields: PropertyField[] = [];

export const properties = createComponentProperties(contentFields, [], [], true);

export const defaultProps = {
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '40', right: '24', bottom: '40', left: '24' },
};
