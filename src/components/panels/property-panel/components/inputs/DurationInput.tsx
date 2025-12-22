import React from 'react';
import type { PropertyInputProps } from './types';
import { createInputStyle } from '../../styles';

export const DurationInput: React.FC<PropertyInputProps> = ({
    value,
    onChange,
    theme
}) => {
    const inputStyle = createInputStyle(theme);
    const durationInputStyle = {
        ...inputStyle,
        textAlign: 'center' as const,
        padding: '4px',
    };

    const val = (value as string) || '00:00:00';
    const parts = val.split(':');
    while (parts.length < 3) parts.unshift('00');
    const [h, m, s] = parts;

    const updatePart = (index: number, newVal: string) => {
        let v = parseInt(newVal) || 0;
        if (v < 0) v = 0;
        if (index > 0 && v > 59) v = 59;
        const strV = v.toString().padStart(2, '0');
        const newParts = [...parts];
        newParts[index] = strV;
        onChange(newParts.join(':'));
    };

    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ flex: 1 }}>
                <input
                    type="number"
                    value={h}
                    onChange={e => updatePart(0, e.target.value)}
                    style={durationInputStyle}
                    placeholder="HH"
                />
                <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>HR</div>
            </div>
            <span style={{ paddingTop: '6px', color: theme.textMuted }}>:</span>
            <div style={{ flex: 1 }}>
                <input
                    type="number"
                    value={m}
                    onChange={e => updatePart(1, e.target.value)}
                    style={durationInputStyle}
                    placeholder="MM"
                />
                <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>MIN</div>
            </div>
            <span style={{ paddingTop: '6px', color: theme.textMuted }}>:</span>
            <div style={{ flex: 1 }}>
                <input
                    type="number"
                    value={s}
                    onChange={e => updatePart(2, e.target.value)}
                    style={durationInputStyle}
                    placeholder="SS"
                />
                <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>SEC</div>
            </div>
        </div>
    );
};
