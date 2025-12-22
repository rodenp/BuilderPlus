import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

export const NumberInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    return (
        <input
            type="number"
            value={(value as number) || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={inputStyle}
        />
    );
};
