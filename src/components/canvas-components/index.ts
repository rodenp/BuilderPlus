// Main exports for canvas components
export * from './types';
export * from './properties';

// Export from the registration system
export {
  registerComponent,
  getRenderer,
  getComponentProperties,
  getComponentDefinitions,
  getDefaultProps,
  isRegistered,
  getRegisteredTypes,
  getChildCreator,
  getComponentHTML,
} from './register';

// Export the built-in component initializer
export { registerBuiltInComponents } from './built-in';
