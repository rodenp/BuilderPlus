import React from 'react';
import { Box } from 'lucide-react';
import { Section } from '../../Section';
import { ColorPicker } from '../../ColorPicker';
import { createInputStyle, createLabelStyle, createSmallInputStyle } from '../../styles';
import type { ComponentPanelProps } from '../types';

export const BorderSection: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    resolveProp,
    expandedSections,
    toggleSection,
    inheritedProps,
    themeDefaults
}) => {
    const [showBorderColorPicker, setShowBorderColorPicker] = React.useState(false);
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
                        value={(component.props.borderWidth as string) || (resolveProp('borderWidth') as string)}
                        onChange={(e) => updateProp('borderWidth', e.target.value)}
                        placeholder="0"
                        style={smallInputStyle}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Style</label>
                    <select
                        value={(component.props.borderStyle as string) || (resolveProp('borderStyle') as string)}
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
            <div style={{ marginTop: '12px' }}>
                <ColorPicker
                    label="Border Color"
                    color={component.props.borderColor as string | null | undefined}
                    onChange={(color) => updateProp('borderColor', color)}
                    isOpen={showBorderColorPicker}
                    onToggle={() => setShowBorderColorPicker(!showBorderColorPicker)}
                    theme={theme}
                    inheritedValue={inheritedProps.borderColor}
                    themeDefault={themeDefaults.borderColor}
                    clearable
                />
            </div>
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Border Radius</label>
                <input
                    type="text"
                    value={(component.props.borderRadius as string) || (resolveProp('borderRadius') as string)}
                    onChange={(e) => updateProp('borderRadius', e.target.value)}
                    placeholder="0"
                    style={inputStyle}
                />
            </div>
        </Section>
    );
};
