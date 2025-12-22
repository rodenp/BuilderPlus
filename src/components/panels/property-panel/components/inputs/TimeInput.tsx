import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

export const TimeInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    return (
        <input
            type="time"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
        />
    );
};
