import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { Section } from '../../Section';
import { BoxModelControl } from '../../BoxModelControl';
import { parseSpacing } from '../../../../../utils/property-resolver';
import type { ComponentPanelProps } from '../types';

export const SpacingSection: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    resolveProp,
    expandedSections,
    toggleSection,
}) => {
    const [marginLinked, setMarginLinked] = useState(false);
    const [paddingLinked, setPaddingLinked] = useState(false);

    // Helper: Resolve spacing to object { top, right, bottom, left }
    const resolveSpacing = (key: string) => parseSpacing(resolveProp(key));

    return (
        <Section
            id="spacing"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Spacing"
            isExpanded={expandedSections.includes('spacing')}
            onToggle={toggleSection}
            theme={theme}
        >
            <BoxModelControl
                margin={
                    (component.props.margin as any) ||
                    resolveSpacing('margin') ||
                    { top: '0', right: '0', bottom: '0', left: '0' }
                }
                padding={
                    (component.props.padding as any) ||
                    resolveSpacing('padding') ||
                    { top: '0', right: '0', bottom: '0', left: '0' }
                }
                onMarginChange={(side, value) => {
                    const currentMargin = (component.props.margin as any) ||
                        resolveSpacing('margin') ||
                        { top: '0', right: '0', bottom: '0', left: '0' };
                    if (marginLinked) {
                        updateProp('margin', { top: value, right: value, bottom: value, left: value });
                    } else {
                        updateProp('margin', { ...currentMargin, [side]: value });
                    }
                }}
                onPaddingChange={(side, value) => {
                    const currentPadding = (component.props.padding as any) ||
                        resolveSpacing('padding') ||
                        { top: '0', right: '0', bottom: '0', left: '0' };
                    if (paddingLinked) {
                        updateProp('padding', { top: value, right: value, bottom: value, left: value });
                    } else {
                        updateProp('padding', { ...currentPadding, [side]: value });
                    }
                }}
                marginLinked={marginLinked}
                paddingLinked={paddingLinked}
                onMarginLinkedChange={setMarginLinked}
                onPaddingLinkedChange={setPaddingLinked}
                theme={theme}
            />
        </Section>
    );
};
