
import React from 'react';
import { Box } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const SpacerPanel: React.FC<ComponentPanelProps> = ({
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
            title="Spacer"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Height</label>
                <input
                    type="text"
                    value={(component.props.height as string) || '32px'}
                    onChange={(e) => updateProp('height', e.target.value)}
                    placeholder="32px"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
