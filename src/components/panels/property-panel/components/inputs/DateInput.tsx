import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

export const DateInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    return (
        <input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
        />
    );
};
