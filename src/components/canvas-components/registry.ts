import type { ComponentType } from '../../types/component-types';
import type { CanvasComponentProps } from './types';

// Import all component renderers
import * as button from './button';
import * as heading from './heading';
import * as paragraph from './paragraph';
import * as text from './text';
import * as image from './image';
import * as video from './video';
import * as link from './link';
import * as divider from './divider';
import * as spacer from './spacer';
import * as container from './container';
import * as columns from './columns';
import * as card from './card';
import * as section from './section';
import * as list from './list';
import * as quote from './quote';
import * as icon from './icon';
import * as input from './input';
import * as textarea from './textarea';
import * as checkbox from './checkbox';
import * as radio from './radio';
import * as select from './select';
import * as form from './form';
import * as menu from './menu';
import * as breadcrumb from './breadcrumb';

// Component registry - maps component type to its module
const componentModules: Record<ComponentType, { Renderer: React.FC<CanvasComponentProps> }> = {
  button,
  heading,
  paragraph,
  text,
  image,
  video,
  link,
  divider,
  spacer,
  container,
  columns,
  card,
  section,
  list,
  quote,
  icon,
  input,
  textarea,
  checkbox,
  radio,
  select,
  form,
  menu,
  breadcrumb,
};

// Get the renderer for a component type
export const getRenderer = (type: ComponentType): React.FC<CanvasComponentProps> | null => {
  const module = componentModules[type];
  return module?.Renderer || null;
};

// Get all registered component types
export const getRegisteredTypes = (): ComponentType[] => {
  return Object.keys(componentModules) as ComponentType[];
};

// Check if a component type is registered
export const isRegistered = (type: string): type is ComponentType => {
  return type in componentModules;
};

export { componentModules };
