
import React from 'react';
import { Type, X } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const SelectPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);
    const selectOptions = (component.props.options as string[]) || ['Option 1', 'Option 2', 'Option 3'];

    return (
        <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Select"
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
                    placeholder="Select an option..."
                    style={inputStyle}
                />
            </div>
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Options</label>
                {selectOptions.map((opt, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                                const newOptions = [...selectOptions];
                                newOptions[index] = e.target.value;
                                updateProp('options', newOptions);
                            }}
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                            onClick={() => {
                                const newOptions = selectOptions.filter((_, i) => i !== index);
                                updateProp('options', newOptions);
                            }}
                            style={{
                                padding: '8px',
                                backgroundColor: theme.bgSecondary,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: theme.textMuted,
                            }}
                            title="Remove option"
                        >
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => {
                        updateProp('options', [...selectOptions, `Option ${selectOptions.length + 1}`]);
                    }}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: theme.primaryBg,
                        color: theme.primaryText,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                    }}
                >
                    + Add Option
                </button>
            </div>
        </Section>
    );
};
