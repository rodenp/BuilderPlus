import type { GlobalStyles } from '../types/bodySettings';

export interface StylePropertyDefinition {
    key: keyof GlobalStyles;
    label: string;
    type: 'text' | 'color' | 'select' | 'number';
    placeholder?: string;
    options?: { label: string; value: string }[]; // For select type
    defaultValue: {
        light: string | number | null;
        dark: string | number | null;
    };
}

export interface StyleGroup {
    id: string;
    title: string;
    icon: string; // Lucide icon name
    properties: StylePropertyDefinition[];
}


export class StyleRegistry {
    private groups: StyleGroup[] = [];

    constructor(initialGroups: StyleGroup[]) {
        this.groups = initialGroups;
    }

    /**
     * Register a new group of properties.
     */
    registerGroup(group: StyleGroup) {
        // Prevent duplicates by ID
        if (!this.groups.find(g => g.id === group.id)) {
            this.groups.push(group);
        }
    }

    /**
     * Add a property to an existing group.
     */
    addProperty(groupId: string, property: StylePropertyDefinition) {
        const group = this.groups.find(g => g.id === groupId);
        if (group) {
            // Check if property key already exists
            if (!group.properties.find(p => p.key === property.key)) {
                group.properties.push(property);
            }
        } else {
            console.warn(`StyleRegistry: Group '${groupId}' not found.`);
        }
    }

    /**
     * Get all registered groups.
     */
    getGroups() {
        return this.groups;
    }
}

// Initial groups definition (moved from static export)
// Initial groups definition (moved from static export)
const defaultGroups: StyleGroup[] = [
    {
        id: 'global-colors',
        title: 'Global Colors',
        icon: 'Palette',
        properties: [
            { key: 'primaryColor', label: 'Primary Color', type: 'color', defaultValue: { light: '#2563eb', dark: '#3b82f6' } },
            { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: { light: '#ffffff', dark: '#1e1e1e' } },
            { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: { light: '#171717', dark: '#e5e5e5' } },
            { key: 'linkColor', label: 'Link Color', type: 'color', defaultValue: { light: '#2563eb', dark: '#60a5fa' } },
            { key: 'borderColor', label: 'Border Color', type: 'color', defaultValue: { light: '#e5e5e5', dark: '#404040' } },
        ]
    },
    {
        id: 'global-typography',
        title: 'Global Typography',
        icon: 'Type',
        properties: [
            {
                key: 'fontFamily', label: 'Font Family', type: 'select', options: [
                    { label: 'Inter', value: 'Inter' },
                    { label: 'Roboto', value: 'Roboto' },
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Arial', value: 'Arial' },
                    { label: 'Times New Roman', value: 'Times New Roman' },
                ],
                defaultValue: { light: 'Inter', dark: 'Inter' }
            },
            { key: 'fontSize', label: 'Base Font Size', type: 'text', placeholder: 'e.g. 16px', defaultValue: { light: '16px', dark: '16px' } },
            { key: 'lineHeight', label: 'Base Line Height', type: 'text', placeholder: 'e.g. 1.5', defaultValue: { light: '1.5', dark: '1.5' } },
        ]
    },
    {
        id: 'global-layout',
        title: 'Global Layout & Spacing',
        icon: 'Layout',
        properties: [
            { key: 'gap', label: 'Default Gap', type: 'text', placeholder: 'e.g. 16px', defaultValue: { light: '16px', dark: '16px' } },
            { key: 'borderRadius', label: 'Default Radius', type: 'text', placeholder: 'e.g. 8px', defaultValue: { light: '0px', dark: '0px' } },
        ]
    }
];

export const globalStyleRegistry = new StyleRegistry(defaultGroups);
export const styleRegistry = globalStyleRegistry.getGroups(); // For backward compatibility if needed, but better to use the registry
