import React from 'react';
import { Layout } from 'lucide-react';
import { Section } from '../../Section';
import { createInputStyle, createLabelStyle } from '../../styles';
import type { ComponentPanelProps } from '../types';

export const LayoutSection: React.FC<ComponentPanelProps> = ({
    theme,
    updateProp,
    resolveProp,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);

    return (
        <Section
            id="layout"
            icon={<Layout style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Layout"
            isExpanded={expandedSections.includes('layout')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Display</label>
                <select
                    value={(resolveProp('display') as string)}
                    onChange={(e) => updateProp('display', e.target.value)}
                    style={inputStyle}
                >
                    <option value="block">Block</option>
                    <option value="inline">Inline</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="none">None</option>
                </select>
            </div>

            {/* Flex properties - shown when display is flex */}
            {(resolveProp('display') as string) === 'flex' && (
                <>
                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>Flex Direction</label>
                        <select
                            value={(resolveProp('flexDirection') as string)}
                            onChange={(e) => updateProp('flexDirection', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="row">Row</option>
                            <option value="row-reverse">Row Reverse</option>
                            <option value="column">Column</option>
                            <option value="column-reverse">Column Reverse</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>Flex Wrap</label>
                        <select
                            value={(resolveProp('flexWrap') as string)}
                            onChange={(e) => updateProp('flexWrap', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="nowrap">No Wrap</option>
                            <option value="wrap">Wrap</option>
                            <option value="wrap-reverse">Wrap Reverse</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>
                            {((resolveProp('flexDirection') as string) || 'row').includes('column')
                                ? 'Justify Content (Vertical)'
                                : 'Justify Content (Horizontal)'}
                        </label>
                        <select
                            value={(resolveProp('justifyContent') as string)}
                            onChange={(e) => updateProp('justifyContent', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="flex-start">Start</option>
                            <option value="flex-end">End</option>
                            <option value="center">Center</option>
                            <option value="space-between">Space Between</option>
                            <option value="space-around">Space Around</option>
                            <option value="space-evenly">Space Evenly</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>
                            {((resolveProp('flexDirection') as string) || 'row').includes('column')
                                ? 'Align Items (Horizontal)'
                                : 'Align Items (Vertical)'}
                        </label>
                        <select
                            value={(resolveProp('alignItems') as string)}
                            onChange={(e) => updateProp('alignItems', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="stretch">Stretch</option>
                            <option value="flex-start">Start</option>
                            <option value="flex-end">End</option>
                            <option value="center">Center</option>
                            <option value="baseline">Baseline</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>Gap</label>
                        <input
                            type="text"
                            value={(resolveProp('gap') as string)}
                            onChange={(e) => updateProp('gap', e.target.value)}
                            placeholder="0"
                            style={inputStyle}
                        />
                    </div>
                </>
            )}
        </Section>
    );
};
