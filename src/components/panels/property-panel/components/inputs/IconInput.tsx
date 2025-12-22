import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

// Reuse SelectInput logic for IconInput for now, but semantically separate
export const IconInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    options,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    return (
        <select
            value={(value as string) || options?.[0]?.value}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
        >
            {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
};
