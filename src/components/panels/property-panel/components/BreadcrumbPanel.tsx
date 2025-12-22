
import React from 'react';
import { Type, X } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const BreadcrumbPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);
    const breadcrumbItems = (component.props.items as string[]) || ['Home', 'Category', 'Page'];

    return (
        <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Breadcrumb"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Separator</label>
                <input
                    type="text"
                    value={(component.props.separator as string) || '/'}
                    onChange={(e) => updateProp('separator', e.target.value)}
                    placeholder="/"
                    style={inputStyle}
                />
            </div>
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Items</label>
                {breadcrumbItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                                const newItems = [...breadcrumbItems];
                                newItems[index] = e.target.value;
                                updateProp('items', newItems);
                            }}
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                            onClick={() => {
                                const newItems = breadcrumbItems.filter((_, i) => i !== index);
                                updateProp('items', newItems);
                            }}
                            style={{
                                padding: '8px',
                                backgroundColor: theme.bgSecondary,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: theme.textMuted,
                            }}
                            title="Remove item"
                        >
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => {
                        updateProp('items', [...breadcrumbItems, `Page ${breadcrumbItems.length + 1}`]);
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
                    + Add Crumb
                </button>
            </div>
        </Section>
    );
};
