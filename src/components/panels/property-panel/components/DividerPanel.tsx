
import React from 'react';
import { Box } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const DividerPanel: React.FC<ComponentPanelProps> = ({
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
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Divider"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Thickness</label>
                <input
                    type="text"
                    value={(component.props.thickness as string) || '1px'}
                    onChange={(e) => updateProp('thickness', e.target.value)}
                    placeholder="1px"
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Color</label>
                <input
                    type="text"
                    value={(component.props.color as string) || '#e5e7eb'}
                    onChange={(e) => updateProp('color', e.target.value)}
                    placeholder="#e5e7eb"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
