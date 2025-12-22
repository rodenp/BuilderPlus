import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Section } from '../../Section';
import { ColorPicker } from '../../ColorPicker';
import type { ComponentPanelProps } from '../types';
import { getDefaultProps } from '../../../../canvas-components/register';

export const ColorSection: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    expandedSections,
    toggleSection,
    // resolveProp, // using inheritedProps mostly
}) => {
    const [showBgPicker, setShowBgPicker] = useState(false);
    const [showTextPicker, setShowTextPicker] = useState(false);

    // We need to access inherited props or defaults similarly to PropertyPanel
    // For now, let's assume resolveProp handles most of it, but ColorPicker in PropertyPanel
    // used some extra logic for `defaultColor` and `themeDefault`.
    // PropertyPanel logic:
    // defaultColor={getDefaultProps(component.type).backgroundColor as string}
    // themeDefault={resolvedThemeDefaults.backgroundColor}
    // inheritedValue={inheritedProps.backgroundColor}

    // We might need to pass down `resolvedThemeDefaults` and `inheritedProps` if we want exact parity.
    // The `ComponentPanelProps` interface might need extending or we calculate it here.
    // Let's check `types.ts` to see what is passed. 
    // currently: component, theme, updateProp, resolveProp, etc.

    // To keep it simple and consistent with the extracted logic, I will rely on `resolveProp` 
    // or simple defaults if exact parity is hard without prop drilling.
    // HOWEVER, `ActiveThemeObject` logic was in PropertyPanel. 

    // Let's implement basics first.

    const defaultProps = getDefaultProps(component.type);

    return (
        <Section
            id="colors"
            icon={<Palette style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Colors"
            isExpanded={expandedSections.includes('colors')}
            onToggle={toggleSection}
            theme={theme}
        >
            <ColorPicker
                label="Background Color"
                color={component.props.backgroundColor as string | null | undefined}
                onChange={(color) => updateProp('backgroundColor', color)}
                isOpen={showBgPicker}
                onToggle={() => {
                    setShowBgPicker(!showBgPicker);
                    setShowTextPicker(false);
                }}
                theme={theme}
                clearable
                defaultColor={defaultProps.backgroundColor as string}
            // For accurate theme defaults, we might need to export the helper from PropertyPanel or pass it down.
            // For now, omitting strict theme default display or using a placeholder if needed.
            // Or better: Pass `inheritedProps` / `themeDefaults` to all simple panels if needed?
            // Let's check if we can live without it for a moment or if we should add it to props.
            />
            <ColorPicker
                label="Text Color"
                color={(component.props as any).textColor as string | null | undefined}
                onChange={(color) => updateProp('textColor', color)}
                isOpen={showTextPicker}
                onToggle={() => {
                    setShowTextPicker(!showTextPicker);
                    setShowBgPicker(false);
                }}
                theme={theme}
                clearable
                defaultColor={defaultProps.textColor as string || defaultProps.color as string}
            />
        </Section>
    );
};
