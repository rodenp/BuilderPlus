import React from 'react';
import type { PropertyInputProps } from './types';

export const BooleanInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    theme
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
                type="checkbox"
                checked={(value as boolean) || false}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '12px', color: theme.text }}>Enabled</span>
        </div>
    );
};
