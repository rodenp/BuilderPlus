
import React from 'react';
import { Type } from 'lucide-react';
import { Section } from '../Section';
import type { ComponentPanelProps } from './types';

export const MenuPanel: React.FC<ComponentPanelProps> = ({
    theme,
    expandedSections,
    toggleSection,
}) => {
    return (
        <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Menu Settings"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
        >
            <p style={{ fontSize: '12px', color: theme.textMuted }}>
                Click on individual menu links in the canvas to edit their text and URL.
                Use the Layout section to change flex direction and spacing.
            </p>
        </Section>
    );
};
