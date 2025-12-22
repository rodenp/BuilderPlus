import React from 'react';
import { Settings } from 'lucide-react';
import { Section } from '../../Section';
import { createInputStyle, createLabelStyle } from '../../styles';
import type { ComponentPanelProps } from '../types';

export const HtmlAttributesSection: React.FC<ComponentPanelProps> = ({
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
            id="attributes"
            icon={<Settings style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="HTML Attributes"
            isExpanded={expandedSections.includes('attributes')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>ID</label>
                <input
                    type="text"
                    value={(component.props.htmlId as string) || ''}
                    onChange={(e) => updateProp('htmlId', e.target.value)}
                    placeholder="element-id"
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Class</label>
                <input
                    type="text"
                    value={(component.props.htmlClass as string) || ''}
                    onChange={(e) => updateProp('htmlClass', e.target.value)}
                    placeholder="class-name"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
