import React from 'react';
import { Box } from 'lucide-react';
import { Section } from '../../Section';
import { createInputStyle, createLabelStyle, createSmallInputStyle } from '../../styles';
import type { ComponentPanelProps } from '../types';

export const BorderSection: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);
    const smallInputStyle = createSmallInputStyle(theme);

    return (
        <Section
            id="border"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Border"
            isExpanded={expandedSections.includes('border')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Width</label>
                    <input
                        type="text"
                        value={(component.props.borderWidth as string) || '0'}
                        onChange={(e) => updateProp('borderWidth', e.target.value)}
                        placeholder="0"
                        style={smallInputStyle}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Style</label>
                    <select
                        value={(component.props.borderStyle as string) || 'solid'}
                        onChange={(e) => updateProp('borderStyle', e.target.value)}
                        style={smallInputStyle}
                    >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <div>
                <label style={labelStyle}>Border Color</label>
                <input
                    type="text"
                    value={(component.props.borderColor as string) || '#e2e8f0'}
                    onChange={(e) => updateProp('borderColor', e.target.value)}
                    placeholder="#e2e8f0"
                    style={inputStyle}
                />
            </div>
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Border Radius</label>
                <input
                    type="text"
                    value={(component.props.borderRadius as string) || '0'}
                    onChange={(e) => updateProp('borderRadius', e.target.value)}
                    placeholder="0"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
