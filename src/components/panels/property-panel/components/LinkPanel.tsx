
import React from 'react';
import { Link } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import { stripHtml } from '../../../../utils/text';
import type { ComponentPanelProps } from './types';

export const LinkPanel: React.FC<ComponentPanelProps> = ({
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
            icon={<Link style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Link"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Link Text</label>
                <input
                    type="text"
                    value={stripHtml((component.props.text as string) || '')}
                    onChange={(e) => updateProp('text', e.target.value)}
                    placeholder="Link text..."
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>URL</label>
                <input
                    type="text"
                    value={(component.props.href as string) || ''}
                    onChange={(e) => updateProp('href', e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Target</label>
                <select
                    value={(component.props.target as string) || '_self'}
                    onChange={(e) => updateProp('target', e.target.value)}
                    style={inputStyle}
                >
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab</option>
                </select>
            </div>
        </Section>
    );
};
