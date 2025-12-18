import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = () => {
    return (
        <div style={{ padding: '8px', fontFamily: 'monospace' }}>
            {new Date().toLocaleTimeString()}
        </div>
    );
};
