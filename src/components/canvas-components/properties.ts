// Property field types for the property panel
export type PropertyFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'color'
  | 'boolean'
  | 'spacing'
  | 'url'
  | 'icon'
  | 'time' // Semantic type: Time (e.g. 12:00 PM)
  | 'date' // Semantic type: Date (e.g. 2025-12-25)
  | 'duration'; // Semantic type: Duration (e.g. 3:00)

export interface PropertyField {
  key: string;
  label: string;
  type: PropertyFieldType;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  placeholder?: string;
  group?: string;
  themeKey?: string; // Links to global theme property (e.g., 'buttonPadding')
}

export interface PropertyGroup {
  id: string;
  label: string;
  icon?: string;
}

export interface ComponentProperties {
  groups: PropertyGroup[];
  fields: PropertyField[];
}

// Base properties that all components share
export const baseSpacingFields: PropertyField[] = [
  { key: 'margin', label: 'Margin', type: 'spacing', group: 'spacing' },
  { key: 'padding', label: 'Padding', type: 'spacing', group: 'spacing', themeKey: 'containerPadding' },
];

export const baseSizeFields: PropertyField[] = [
  { key: 'width', label: 'Width', type: 'text', placeholder: 'auto', group: 'size' },
  { key: 'height', label: 'Height', type: 'text', placeholder: 'auto', group: 'size' },
];

export const baseBorderFields: PropertyField[] = [
  { key: 'borderWidth', label: 'Border Width', type: 'number', defaultValue: 0, group: 'border' },
  {
    key: 'borderStyle', label: 'Border Style', type: 'select', defaultValue: 'solid', group: 'border', options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
      { label: 'None', value: 'none' },
    ]
  },
  { key: 'borderColor', label: 'Border Color', type: 'color', group: 'border', themeKey: 'borderColor' },
  { key: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 0, group: 'border', themeKey: 'borderRadius' },
];

export const baseColorFields: PropertyField[] = [
  { key: 'backgroundColor', label: 'Background', type: 'color', group: 'colors', themeKey: 'backgroundColor' },
  { key: 'color', label: 'Text Color', type: 'color', group: 'colors', themeKey: 'textColor' },
];

export const baseLayoutFields: PropertyField[] = [
  {
    key: 'display', label: 'Display', type: 'select', defaultValue: 'block', group: 'layout', options: [
      { label: 'Block', value: 'block' },
      { label: 'Flex', value: 'flex' },
      { label: 'Inline', value: 'inline' },
      { label: 'Inline Flex', value: 'inline-flex' },
      { label: 'Grid', value: 'grid' },
    ]
  },
  {
    key: 'flexDirection', label: 'Direction', type: 'select', defaultValue: 'row', group: 'layout', options: [
      { label: 'Row', value: 'row' },
      { label: 'Column', value: 'column' },
      { label: 'Row Reverse', value: 'row-reverse' },
      { label: 'Column Reverse', value: 'column-reverse' },
    ]
  },
  {
    key: 'justifyContent', label: 'Justify', type: 'select', defaultValue: 'flex-start', group: 'layout', options: [
      { label: 'Start', value: 'flex-start' },
      { label: 'Center', value: 'center' },
      { label: 'End', value: 'flex-end' },
      { label: 'Space Between', value: 'space-between' },
      { label: 'Space Around', value: 'space-around' },
    ]
  },
  {
    key: 'alignItems', label: 'Align', type: 'select', defaultValue: 'stretch', group: 'layout', options: [
      { label: 'Stretch', value: 'stretch' },
      { label: 'Start', value: 'flex-start' },
      { label: 'Center', value: 'center' },
      { label: 'End', value: 'flex-end' },
    ]
  },
  { key: 'gap', label: 'Gap', type: 'number', defaultValue: 0, group: 'layout' },
];

// Common property groups
export const commonGroups: PropertyGroup[] = [
  { id: 'content', label: 'Content' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'size', label: 'Size' },
  { id: 'colors', label: 'Colors' },
  { id: 'border', label: 'Border' },
  { id: 'layout', label: 'Layout' },
];

// Helper to create component properties with common fields
export const createComponentProperties = (
  contentFields: PropertyField[],
  additionalGroups: PropertyGroup[] = [],
  additionalFields: PropertyField[] = [],
  includeLayout = false,
  fieldOverrides: Record<string, Partial<PropertyField>> = {}
): ComponentProperties => {
  const baseFields = [
    ...contentFields,
    ...baseSpacingFields,
    ...baseSizeFields,
    ...baseColorFields,
    ...baseBorderFields,
    ...(includeLayout ? baseLayoutFields : []),
    ...additionalFields,
  ];

  // Apply overrides
  const fields = baseFields.map(field => {
    if (fieldOverrides[field.key]) {
      return { ...field, ...fieldOverrides[field.key] };
    }
    return field;
  });

  return {
    groups: [
      ...commonGroups.filter(g =>
        g.id !== 'layout' || includeLayout
      ),
      ...additionalGroups,
    ],
    fields,
  };
};
