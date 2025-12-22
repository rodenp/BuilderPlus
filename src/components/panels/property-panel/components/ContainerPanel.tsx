
import React from 'react';
import { Box } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const ContainerPanel: React.FC<ComponentPanelProps> = ({
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
            title="Container"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <p style={{ fontSize: '12px', color: theme.textMuted }}>
                Container for grouping components. Use Layout section to configure flex properties.
            </p>
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Scroll Behavior</label>
                <select
                    value={(component.props.overflow as string) || 'visible'}
                    onChange={(e) => updateProp('overflow', e.target.value)}
                    style={inputStyle}
                >
                    <option value="auto">Auto (Scroll)</option>
                    <option value="visible">Visible (Grow)</option>
                    <option value="hidden">Hidden (Clip)</option>
                    <option value="scroll">Scroll (Always)</option>
                </select>
            </div>
        </Section>
    );
};
