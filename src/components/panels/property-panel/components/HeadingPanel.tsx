
import React from 'react';
import { Type } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import { RichTextPropertyInput } from '../RichTextPropertyInput';
import { getDefaultProps } from '../../../canvas-components/register';
import type { ComponentPanelProps } from './types';

export const HeadingPanel: React.FC<ComponentPanelProps> = ({
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
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Content"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <div>
                <label style={labelStyle}>Heading Text</label>
                {(() => {
                    const defaults = getDefaultProps('heading');
                    const value = resolveProp('text') as string;
                    // If the value is explicitly provided in props, use it. 
                    // Otherwise, we show the default but don't force it into the data until edited.
                    const displayValue = value ?? (defaults.text as string) ?? '';

                    return (
                        <RichTextPropertyInput
                            value={displayValue}
                            onChange={(val) => updateProp('text', val)}
                            placeholder="Enter heading..."
                            style={{ ...inputStyle, minHeight: '32px' }}
                        />
                    );
                })()}
            </div>
            <div>
                <label style={labelStyle}>Heading Level</label>
                <select
                    value={(resolveProp('level') as string) || 'h2'}
                    onChange={(e) => updateProp('level', e.target.value)}
                    style={inputStyle}
                >
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                </select>
            </div>
        </Section>
    );
};
