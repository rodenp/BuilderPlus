import React, { useState } from 'react';
import type { PropertyInputProps } from './types';
import { ColorPicker } from '../../ColorPicker';

export const ColorInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    label,
    theme,
    defaultValue,
    inheritedValue,
    themeDefault
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ColorPicker
                label={label || 'Color'}
                color={value as string | null | undefined}
                onChange={onChange}
                isOpen={isOpen}
                onToggle={() => setIsOpen(!isOpen)}
                theme={theme}
                clearable
                defaultColor={defaultValue || ''}
                themeDefault={themeDefault}
                inheritedValue={inheritedValue}
            />
        </div>
    );
};
