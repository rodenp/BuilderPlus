import React from 'react';
import type { PropertyField } from '../../../canvas-components/properties';
import type { Theme } from '../theme';
import { createInputStyle } from '../styles';

interface RendererProps {
    property: PropertyField;
    value: unknown;
    onChange: (value: unknown) => void;
    theme: Theme;
}

// Map of property types to their renderers
export const renderers: Record<string, React.FC<RendererProps>> = {
    // Basic types
    text: ({ property, value, onChange, theme }) => (
        <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder || `${property.label}...`}
            style={createInputStyle(theme)}
        />
    ),
    
    number: ({ value, onChange, theme }) => (
        <input
            type="number"
            value={(value as number) || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={createInputStyle(theme)}
        />
    ),
    
    boolean: ({ value, onChange, theme }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
                type="checkbox"
                checked={(value as boolean) || false}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '12px', color: theme.text }}>Enabled</span>
        </div>
    ),
    
    color: ({ value, onChange, theme }) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
                type="color"
                value={(value as string) || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '32px', height: '32px', padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <input
                type="text"
                value={(value as string) || ''}
                onChange={(e) => onChange(e.target.value)}
                style={createInputStyle(theme)}
            />
        </div>
    ),
    
    select: ({ property, value, onChange, theme }) => (
        <select
            value={(value as string) || property.options?.[0]?.value}
            onChange={(e) => onChange(e.target.value)}
            style={createInputStyle(theme)}
        >
            {property.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    ),

    // --- Semantic types ---
    
    duration: ({ value, onChange, theme }) => (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>⏱</span>
            <input
                type="text"
                value={(value as string) || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="mm:ss"
                style={{ ...createInputStyle(theme), fontFamily: 'monospace' }} 
            />
        </div>
    ),

    icon: ({ property, value, onChange, theme }) => (
        <select
            value={(value as string) || 'Music'}
            onChange={(e) => onChange(e.target.value)}
            style={createInputStyle(theme)}
        >
            {property.options ? (
                property.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))
            ) : (
                <>
                    <option value="Music">Music</option>
                    <option value="Play">Play</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Mic">Mic</option>
                </>
            )}
        </select>
    )
};

export const getRendererForType = (type: string) => {
    return renderers[type] || renderers['text'];
};
