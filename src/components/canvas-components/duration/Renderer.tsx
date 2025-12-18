import React from 'react';
import { Timer } from 'lucide-react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
    component,
    canvasTheme,
    commonStyles,
}) => {
    const { props } = component;
    const showIcon = props.showIcon !== false; // Default true
    const duration = (props.duration as string) || '00:00:00';

    // Optional: Pretty print the duration (remove leading zeros from hours if 00)
    const formatDuration = (d: string) => {
        if (!d) return '00:00';
        const parts = d.split(':');
        if (parts[0] === '00' && parts.length === 3) {
            return `${parts[1]}:${parts[2]}`; // MM:SS
        }
        return d; // HH:MM:SS
    };

    const styles: React.CSSProperties = {
        color: commonStyles.color || canvasTheme.text,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor,
        width: commonStyles.width,
        fontSize: '13px',
        fontVariantNumeric: 'tabular-nums', // Monospace numbers for alignment
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                ...commonStyles,
                ...styles,
            }}
        >
            {showIcon && <Timer size={14} />}
            <span
                style={{
                    display: 'inline-block',
                    ...commonStyles,
                    ...styles,
                }}
            >
                {formatDuration(duration)}
            </span>
        </div>
    );
};
