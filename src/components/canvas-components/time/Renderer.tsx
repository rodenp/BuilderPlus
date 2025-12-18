import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
    commonStyles,
}) => {
    return (
        <div style={{ ...commonStyles, padding: '8px', fontFamily: 'monospace' }}>
            {new Date().toLocaleTimeString()}
        </div>
    );
};
