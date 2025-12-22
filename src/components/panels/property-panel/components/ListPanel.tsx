
import React from 'react';
import { Type } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const ListPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);

    return (
        <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="List Settings"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>List Type</label>
                <select
                    value={(component.props.listType as string) || 'unordered'}
                    onChange={(e) => updateProp('listType', e.target.value)}
                    style={inputStyle}
                >
                    <option value="unordered">Unordered (bullets)</option>
                    <option value="ordered">Ordered (numbers)</option>
                </select>
            </div>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '12px' }}>
                Click on individual list items in the canvas to edit their text properties.
                Use the Layout section to change flex display settings.
            </p>
        </Section>
    );
};
