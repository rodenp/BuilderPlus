import React from 'react';
import type { CanvasComponentProps } from '../../../components/canvas-components/types';
import { ContainerDroppable } from '../../../components/layout/ContainerDroppable';

export const Renderer: React.FC<CanvasComponentProps> = ({
    component,
    canvasTheme,
    commonStyles,
    uiTheme,
    builderContext
}) => {
    const { props } = component;

    // Split commonStyles into Container (Card) styles and Content (Layout) styles
    const {
        display, flexDirection, flexWrap, justifyContent, alignItems, gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        ...wrapperStyles // Background, Border, Radius, Width, Height, Margin
    } = commonStyles;

    const layoutStyles = {
        display: display || 'flex',
        flexDirection: flexDirection || 'column',
        flexWrap,
        justifyContent,
        alignItems,
        gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft
    };

    return (
        <div className={`mockup-theme ${component.type}`} style={{ height: '100%' }}>
            <div className="flex-container-wrapper" style={{ width: '100%', height: '100%' }}>
                {/* Removed manual class overrides. wrapperStyles now contains border/bg from properties */}
                <div className="flex-container" style={wrapperStyles}>
                    <div className="flex-container-header">
                        <button className="flex-container-collapse">▼</button>
                        <span className="flex-container-label">{props.title as string || 'Untitled'}</span>
                        <span className="flex-container-type">{(props.type as string) || component.type}</span>
                        {props.count !== undefined && (
                            <span className="flex-container-count">{props.count as string}</span>
                        )}
                    </div>

                    <div className="flex-container-content">
                        <ContainerDroppable
                            containerId={component.id}
                            containerType={component.type}
                            children={component.children || []}
                            builderContext={builderContext}
                            theme={uiTheme}
                            canvasTheme={canvasTheme}
                            style={{
                                minHeight: '30px',
                                ...layoutStyles as any
                            }}
                            emptyContent={<div className="flex-container-empty">Drop here</div>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
