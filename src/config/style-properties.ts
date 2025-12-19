export type PropertyFieldType = 'text' | 'color' | 'select' | 'number' | 'boolean' | 'spacing';

export interface StylePropertyDefinition {
    key: string;
    label: string;
    type: PropertyFieldType;
    group: string; // The UI section it belongs to (e.g., 'Colors', 'Typography')
    systemFallback?: any;
    placeholder?: string;
    options?: { label: string; value: string }[];
}

export interface StyleGroup {
    id: string; // Usually a slug of the group name
    title: string;
    icon: string; // Lucide icon name
    properties: StylePropertyDefinition[];
}

export class StyleRegistry {
    private groups: StyleGroup[] = [];

    /**
     * Get all registered groups for the Theme Panel.
     */
    getGroups() {
        return this.groups;
    }

    /**
     * Register multiple style fields at once.
     * If the group doesn't exist, it will be created.
     */
    registerStyleFields(fields: StylePropertyDefinition[]) {
        fields.forEach(field => {
            let group = this.groups.find(g => g.title === field.group);

            if (!group) {
                const groupId = field.group.toLowerCase().replace(/\s+/g, '-');
                group = {
                    id: groupId,
                    title: field.group,
                    icon: this.getIconForGroup(field.group),
                    properties: []
                };
                this.groups.push(group);
            }

            // Prevent duplicate keys within the group (or registry-wide)
            const existing = group.properties.find(p => p.key === field.key);
            if (!existing) {
                group.properties.push(field);
            }
        });
    }

    private getIconForGroup(groupName: string): string {
        const name = groupName.toLowerCase();
        if (name.includes('color')) return 'Palette';
        if (name.includes('type') || name.includes('font')) return 'Type';
        if (name.includes('layout') || name.includes('spacing')) return 'Layout';
        if (name.includes('effect')) return 'Sparkles';
        return 'Settings';
    }
}

// Global singleton instance
export const globalStyleRegistry = new StyleRegistry();

/**
 * Public SDK API: registerStyleFields
 */
export const registerStyleFields = (fields: StylePropertyDefinition[]) => {
    globalStyleRegistry.registerStyleFields(fields);
};

// --- CORE SYSTEM METADATA ---
// We register the base properties immediately.
// Actual values are defined in ThemeRegistry.
registerStyleFields([
    // Colors
    { key: 'primaryColor', label: 'Primary Color', type: 'color', group: 'Colors', systemFallback: '#2563eb' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', group: 'Colors', systemFallback: '#ffffff' },
    { key: 'textColor', label: 'Text Color', type: 'color', group: 'Colors', systemFallback: '#171717' },
    { key: 'linkColor', label: 'Link Color', type: 'color', group: 'Colors', systemFallback: '#2563eb' },
    { key: 'borderColor', label: 'Border Color', type: 'color', group: 'Colors', systemFallback: '#e5e5e5' },

    // Typography - Base
    {
        key: 'fontFamily',
        label: 'Font Family',
        type: 'select',
        group: 'Typography',
        options: [
            { label: 'Inter', value: 'Inter' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Arial', value: 'Arial' },
        ],
        systemFallback: 'Inter'
    },
    { key: 'fontSize', label: 'Base Font Size', type: 'text', group: 'Typography', systemFallback: '16px' },
    { key: 'lineHeight', label: 'Base Line Height', type: 'text', group: 'Typography', systemFallback: '1.5' },

    // Typography - Headings & Paragraphs
    { key: 'h1Color', label: 'H1 Color', type: 'color', group: 'Typography', systemFallback: '#171717' },
    { key: 'h1FontSize', label: 'H1 Size', type: 'text', group: 'Typography', systemFallback: '48px' },
    { key: 'h1LineHeight', label: 'H1 Height', type: 'text', group: 'Typography', systemFallback: '1.2' },
    { key: 'h1MarginBottom', label: 'H1 Margin', type: 'spacing', group: 'Typography', systemFallback: '24px' },

    { key: 'h2Color', label: 'H2 Color', type: 'color', group: 'Typography', systemFallback: '#171717' },
    { key: 'h2FontSize', label: 'H2 Size', type: 'text', group: 'Typography', systemFallback: '36px' },
    { key: 'h2LineHeight', label: 'H2 Height', type: 'text', group: 'Typography', systemFallback: '1.3' },
    { key: 'h2MarginBottom', label: 'H2 Margin', type: 'spacing', group: 'Typography', systemFallback: '20px' },

    { key: 'h3Color', label: 'H3 Color', type: 'color', group: 'Typography', systemFallback: '#171717' },
    { key: 'h3FontSize', label: 'H3 Size', type: 'text', group: 'Typography', systemFallback: '30px' },
    { key: 'h3LineHeight', label: 'H3 Height', type: 'text', group: 'Typography', systemFallback: '1.3' },
    { key: 'h3MarginBottom', label: 'H3 Margin', type: 'spacing', group: 'Typography', systemFallback: '16px' },

    { key: 'paragraphColor', label: 'Paragraph Color', type: 'color', group: 'Typography', systemFallback: '#374151' },
    { key: 'paragraphFontSize', label: 'Paragraph Size', type: 'text', group: 'Typography', systemFallback: '16px' },
    { key: 'paragraphLineHeight', label: 'Paragraph Height', type: 'text', group: 'Typography', systemFallback: '1.6' },
    { key: 'paragraphMarginBottom', label: 'Paragraph Margin', type: 'spacing', group: 'Typography', systemFallback: '16px' },

    { key: 'linkTextDecoration', label: 'Link Decoration', type: 'text', group: 'Typography', systemFallback: 'none' },

    { key: 'quoteBg', label: 'Quote Background', type: 'color', group: 'Typography', systemFallback: '#f9fafb' },
    { key: 'quoteBorderColor', label: 'Quote Border', type: 'color', group: 'Typography', systemFallback: '#e5e5e5' },
    { key: 'quoteFontStyle', label: 'Quote Style', type: 'text', group: 'Typography', systemFallback: 'italic' },

    { key: 'listItemSpacing', label: 'List Spacing', type: 'spacing', group: 'Typography', systemFallback: '8px' },

    // Buttons
    { key: 'buttonPrimaryBg', label: 'Button Primary Bg', type: 'color', group: 'Buttons', systemFallback: '#2563eb' },
    { key: 'buttonPrimaryText', label: 'Button Primary Text', type: 'color', group: 'Buttons', systemFallback: '#ffffff' },
    { key: 'buttonSecondaryBg', label: 'Button Secondary Bg', type: 'color', group: 'Buttons', systemFallback: '#e5e5e5' },
    { key: 'buttonSecondaryText', label: 'Button Secondary Text', type: 'color', group: 'Buttons', systemFallback: '#171717' },
    { key: 'buttonBorderRadius', label: 'Button Radius', type: 'text', group: 'Buttons', systemFallback: '4px' },
    { key: 'buttonPadding', label: 'Button Padding', type: 'spacing', group: 'Buttons', systemFallback: '12px 24px' },

    // Layout
    { key: 'gap', label: 'Default Gap', type: 'text', group: 'Layout & Spacing', systemFallback: '16px' },
    { key: 'borderRadius', label: 'Default Radius', type: 'text', group: 'Layout & Spacing', systemFallback: '0px' },
    { key: 'containerPadding', label: 'Container Padding', type: 'spacing', group: 'Layout & Spacing', systemFallback: '20px' },
    { key: 'containerBg', label: 'Container Bg', type: 'color', group: 'Layout & Spacing', systemFallback: 'transparent' },
    { key: 'sectionPadding', label: 'Section Padding', type: 'spacing', group: 'Layout & Spacing', systemFallback: '40px 20px' },
    { key: 'columnGap', label: 'Column Gap', type: 'spacing', group: 'Layout & Spacing', systemFallback: '24px' },
    { key: 'dividerColor', label: 'Divider Color', type: 'color', group: 'Layout & Spacing', systemFallback: '#e5e5e5' },
    { key: 'spacerBg', label: 'Spacer Bg', type: 'color', group: 'Layout & Spacing', systemFallback: 'transparent' },

    // Cards
    { key: 'cardBg', label: 'Card Bg', type: 'color', group: 'Cards', systemFallback: '#ffffff' },
    { key: 'cardBorder', label: 'Card Border', type: 'text', group: 'Cards', systemFallback: '1px solid #e5e5e5' },
    { key: 'cardBorderRadius', label: 'Card Radius', type: 'text', group: 'Cards', systemFallback: '8px' },
    { key: 'cardPadding', label: 'Card Padding', type: 'spacing', group: 'Cards', systemFallback: '24px' },
    { key: 'cardShadow', label: 'Card Shadow', type: 'text', group: 'Cards', systemFallback: '0 4px 6px -1px rgba(0,0,0,0.1)' },

    // Forms & Media
    { key: 'formPadding', label: 'Form Padding', type: 'spacing', group: 'Forms', systemFallback: '24px' },
    { key: 'mediaPlaceholderPadding', label: 'Media Placeholder Pattern', type: 'spacing', group: 'Media', systemFallback: '40px' },
]);

export const styleRegistry = globalStyleRegistry.getGroups();
