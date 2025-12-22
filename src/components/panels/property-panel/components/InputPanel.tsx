
import React from 'react';
import { Type } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const InputPanel: React.FC<ComponentPanelProps> = ({
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
            title="Input"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Label</label>
                <input
                    type="text"
                    value={(component.props.label as string) || ''}
                    onChange={(e) => updateProp('label', e.target.value)}
                    placeholder="Label..."
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Placeholder</label>
                <input
                    type="text"
                    value={(component.props.placeholder as string) || ''}
                    onChange={(e) => updateProp('placeholder', e.target.value)}
                    placeholder="Placeholder..."
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Input Type</label>
                <select
                    value={(component.props.type as string) || 'text'}
                    onChange={(e) => updateProp('type', e.target.value)}
                    style={inputStyle}
                >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="number">Number</option>
                    <option value="tel">Phone</option>
                </select>
            </div>
        </Section>
    );
};
