import React from 'react';
import { Calendar } from 'lucide-react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
    component,
    canvasTheme,
    commonStyles,
}) => {
    const { props } = component;
    const showIcon = props.showIcon !== false; // Default true
    const dateStr = (props.date as string) || '';

    // Format date for display (e.g. "Dec 16, 2025")
    const formatDate = (d: string) => {
        if (!d) return 'Select Date';
        try {
            const date = new Date(d);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return d;
        }
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
            {showIcon && <Calendar size={14} />}
            <span style={{ ...commonStyles, ...styles }}>
                {formatDate(dateStr)}
            </span>
        </div>
    );
};
