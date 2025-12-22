import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

export const TextInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    placeholder,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    return (
        <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={inputStyle}
        />
    );
};
