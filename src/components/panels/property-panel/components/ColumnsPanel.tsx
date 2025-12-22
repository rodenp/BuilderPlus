
import React from 'react';
import { Layout } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const ColumnsPanel: React.FC<ComponentPanelProps> = ({
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
            icon={<Layout style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Columns"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Number of Columns</label>
                <select
                    value={(component.props.columns as number) || 2}
                    onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                    style={inputStyle}
                >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                </select>
            </div>
            <div>
                <label style={labelStyle}>Gap</label>
                <input
                    type="text"
                    value={(component.props.gap as string) || '16px'}
                    onChange={(e) => updateProp('gap', e.target.value)}
                    placeholder="16px"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
