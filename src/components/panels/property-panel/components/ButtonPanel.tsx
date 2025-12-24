
import React from 'react';
import { Type, MousePointerClick } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import { stripHtml } from '../../../../utils/text';
import type { ComponentPanelProps } from './types';

export const ButtonPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    resolveProp,
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
                    <label style={labelStyle}>Button Text</label>
                    <input
                        type="text"
                        value={stripHtml((resolveProp('text') as string) || '')}
                        onChange={(e) => updateProp('text', e.target.value)}
                        placeholder="Enter button text..."
                        style={inputStyle}
                    />
                </div>
            </Section>

            <Section
                id="actions"
                icon={<MousePointerClick style={{ width: 16, height: 16, color: theme.textMuted }} />}
                title="Actions"
                isExpanded={expandedSections.includes('actions')}
                onToggle={toggleSection}
                theme={theme}
            >
                {/* Action Type Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={labelStyle}>Action Type</label>
                    <select
                        value={(resolveProp('actionType') as string) || 'link'}
                        onChange={(e) => updateProp('actionType', e.target.value)}
                        style={{
                            ...inputStyle,
                            width: 'auto',
                            minWidth: '140px',
                            height: '32px',
                            padding: '0 8px',
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                            borderColor: theme.border
                        }}
                    >
                        <option value="link">Open Website</option>
                        <option value="submit">Submit Form</option>
                        <option value="scroll">Scroll to Section</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="none">None</option>
                    </select>
                </div>

                {/* Compact Input Group Helper */}
                {(component.props.actionType === 'link' || !component.props.actionType) && (
                    <>
                        {/* URL Row */}
                        <div style={{ display: 'flex', marginBottom: '8px', border: `1px solid ${theme.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{
                                width: '80px',
                                backgroundColor: theme.bgSecondary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: `1px solid ${theme.border}`,
                                fontSize: '12px',
                                color: theme.textMuted,
                                fontWeight: 500
                            }}>
                                URL
                            </div>
                            <input
                                type="text"
                                value={(resolveProp('url') as string) || ''}
                                onChange={(e) => updateProp('url', e.target.value)}
                                placeholder="https://"
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    height: '32px',
                                    padding: '0 8px',
                                    outline: 'none',
                                    fontSize: '13px',
                                    backgroundColor: 'transparent',
                                    color: theme.text
                                }}
                            />
                        </div>

                        {/* Target Row */}
                        <div style={{ display: 'flex', border: `1px solid ${theme.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{
                                width: '80px',
                                backgroundColor: theme.bgSecondary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: `1px solid ${theme.border}`,
                                fontSize: '12px',
                                color: theme.textMuted,
                                fontWeight: 500
                            }}>
                                Target
                            </div>
                            <select
                                value={(resolveProp('target') as string) || '_self'}
                                onChange={(e) => updateProp('target', e.target.value)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    height: '32px',
                                    padding: '0 8px',
                                    outline: 'none',
                                    fontSize: '13px',
                                    backgroundColor: 'transparent',
                                    color: theme.text
                                }}
                            >
                                <option value="_self">Same Tab</option>
                                <option value="_blank">New Tab</option>
                            </select>
                        </div>
                    </>
                )}
            </Section>
        </>
    );
};
