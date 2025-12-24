
import React from 'react';
import { Type, Box } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import { RichTextPropertyInput } from '../RichTextPropertyInput';
import { getDefaultProps } from '../../../canvas-components/register';
import type { ComponentPanelProps } from './types';

export const TextPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);

    return (
        <>
            <Section
                id="content"
                icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
                title="Content"
                isExpanded={expandedSections.includes('content')}
                onToggle={toggleSection}
                theme={theme}
            >
                <div>
                    <label style={labelStyle}>Text</label>
                    {(() => {
                        const defaults = getDefaultProps('text');
                        const value = component.props.text as string;
                        const displayValue = value ?? (defaults.text as string) ?? '';

                        return (
                            <RichTextPropertyInput
                                value={displayValue}
                                onChange={(val) => updateProp('text', val)}
                                placeholder="Enter text..."
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                        );
                    })()}
                </div>
            </Section>

            <Section
                id="dimensions"
                icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
                title="Dimensions & Scroll"
                isExpanded={expandedSections.includes('content')}
                onToggle={toggleSection}
                theme={theme}
            >
                <div>
                    <label style={labelStyle}>Height</label>
                    <input
                        type="text"
                        value={(component.props.height as string) || ''}
                        onChange={(e) => updateProp('height', e.target.value)}
                        placeholder="auto"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Max Height</label>
                    <input
                        type="text"
                        value={(component.props.maxHeight as string) || ''}
                        onChange={(e) => updateProp('maxHeight', e.target.value)}
                        placeholder="none"
                        style={inputStyle}
                    />
                </div>
                <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Scroll Behavior</label>
                    <select
                        value={(component.props.overflow as string) || 'auto'}
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
        </>
    );
};
