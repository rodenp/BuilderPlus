import React from 'react';
import type { CanvasComponentProps } from '../../../components/canvas-components/types';

export const Renderer: React.FC<CanvasComponentProps> = ({ component, commonStyles }) => {
    // Cast props to any to avoid "Type 'unknown' is not assignable to type 'ReactNode'" errors
    // when using conditional rendering.
    const props = component.props as any;

    // Mimic the original class logic (ID only)
    let itemClass = 'flex-item';
    if (props.duration || props.icon === 'Music') itemClass += ' flex-item--track';
    else if (props.checked !== undefined) itemClass += ` flex-item--task ${props.checked ? 'flex-item--done' : ''}`;
    else if (props.color) itemClass += ' flex-item--photo';
    else if (props.icon === 'FileText') itemClass += ' flex-item--file';

    // Split styles
    const {
        width, height, marginTop, marginRight, marginBottom, marginLeft,
        ...visualStyles // BG, Border, Radius, Padding, Gap, Color
    } = commonStyles;

    const wrapperStyles = {
        width, height,
        marginTop, marginRight, marginBottom, marginLeft
    };

    return (
        <div className="mockup-theme" style={wrapperStyles}>
            <div className="flex-item-wrapper">
                <div
                    className={itemClass}
                    style={{
                        ...visualStyles,
                        ...(props.color ? { background: props.color } : {})
                    }}
                >
                    {props.checked !== undefined && (
                        <span className="flex-item-check">{props.checked ? '✓' : '○'}</span>
                    )}
                    {props.icon === 'Music' && <span className="flex-item-icon">♪</span>}
                    {props.icon === 'FileText' && <span className="flex-item-icon">📄</span>}
                    {props.icon === 'FileEdit' && <span className="flex-item-icon">📝</span>}
                    {props.color && props.emoji && <span className="flex-item-emoji" style={{ fontSize: '18px' }}>{props.emoji}</span>}

                    {props.title && !props.emoji && (
                        <span className="flex-item-title">{props.title}</span>
                    )}
                    {props.text && (
                        <span className="flex-item-title">{props.text}</span>
                    )}

                    {props.duration && (
                        <span className="flex-item-meta">{props.duration}</span>
                    )}
                    {/* Fallback for generic items */}
                    {!props.title && !props.text && !props.duration && (
                        <span className="flex-item-title">Item</span>
                    )}
                </div>
            </div>
        </div>
    );
};
