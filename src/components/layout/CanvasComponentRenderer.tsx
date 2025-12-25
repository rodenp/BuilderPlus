import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { CanvasComponent } from '../../types/component-types';
import type { Theme as UITheme } from '../panels/property-panel/theme';
import type { Theme } from '../../types/theme';
import { DragTypes } from '../../types/dnd-types';
import { getRenderer, getDefaultProps, isContainer as isRegisteredContainer } from '../../components/canvas-components/register';
import { extractCommonStyles } from '../../components/canvas-components/types';

import type { CanvasTheme } from '../../components/canvas-components/types';
import { ContainerDroppable } from './ContainerDroppable';
import { customContainerRegistry } from '../../config/custom-containers';
import { getMergedProps } from '../../utils/inheritance';

interface CanvasComponentRendererProps {
    component: CanvasComponent;
    index: number;
    parentId: string | null;
    builderContext: any;
    theme: UITheme;
    activeThemeObject?: Theme;
    canvasTheme: CanvasTheme;
    parentFlexDirection?: string;
}

export const CanvasComponentRenderer: React.FC<CanvasComponentRendererProps> = ({
    component,
    index,
    parentId,
    builderContext,
    theme,
    activeThemeObject,
    canvasTheme,
    parentFlexDirection = 'column',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { selectComponent, selectedId } = builderContext;

    const isSelected = selectedId === component.id;

    // DRAG logic
    const [{ isDragging }, drag] = useDrag({
        type: DragTypes.ITEM,
        item: {
            id: component.id,
            index,
            parentId,
            type: component.type,
            entity: component
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: any, monitor) => {
            if (item && item.id) {
                builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
            }
        },
    });

    // DROP logic
    const [{ handlerId }, drop] = useDrop({
        accept: [DragTypes.ITEM, DragTypes.NEW_COMPONENT],
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        drop: (item: any) => {
            if (item.id && (item as any).isInstantiated) {
                builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
            }
        },
        hover(item: any, monitor) {
            if (!ref.current) return;
            const isOverShallow = monitor.isOver({ shallow: true });

            if (!isOverShallow) return;

            const hoverIndex = index;
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;

            const isHorizontal = parentFlexDirection.includes('row');

            // Determine if mouse is in the first half or second half
            let isAfter = false;
            if (isHorizontal) {
                isAfter = hoverClientX > hoverMiddleX;
            } else {
                isAfter = hoverClientY > hoverMiddleY;
            }

            const targetIndex = isAfter ? hoverIndex + 1 : hoverIndex;

            // Determine if this is an "Extreme" position (top or bottom)
            const parent = parentId ? builderContext.findContainer(parentId) : null;
            const parentChildren = parent ? (parent.children || []) : builderContext.components;

            const isNew = item.type === DragTypes.NEW_COMPONENT;
            const isCrossParent = item.parentId !== parentId;
            const isExtreme = targetIndex === 0 || targetIndex >= parentChildren.length;

            if (isNew || isCrossParent) {
                // If this is a cross-parent move or a new component, handle placeholder
                if (isNew && (item as any).isInstantiated && (item as any).id) {
                    if (item.parentId === parentId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, parentId, targetIndex);
                    builderContext.updateComponent(item.id, { props: { ...item.props, isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = parentId;
                    return;
                }

                if (isNew) {
                    const newId = builderContext.addComponent(
                        { ...item.componentDef, props: { ...item.componentDef.props, isPlaceholder: isExtreme } },
                        parentId,
                        targetIndex
                    );
                    (item as any).isInstantiated = true;
                    (item as any).id = newId;
                    item.index = targetIndex;
                    item.parentId = parentId;
                    return;
                }

                // Cross-parent move for existing item
                if (item.id && item.id !== component.id) {
                    if (item.parentId === parentId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, parentId, targetIndex);
                    // Set placeholder true if extreme cross-parent, else false (kanban reorder)
                    builderContext.updateComponent(item.id, { props: { ...item.props, isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = parentId;
                }
            } else {
                // Normal Kanban move within same parent (no placeholder)
                if (item.id && item.id !== component.id) {
                    if (item.parentId === parentId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, parentId, targetIndex);
                    // ALWAYS false for internal reorders
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
                    item.index = targetIndex;
                    item.parentId = parentId;
                }
            }
        },
    });

    drag(drop(ref));

    // Improved container detection: check both system registry and custom registry
    const isContainer = customContainerRegistry.isContainer(component.type) || isRegisteredContainer(component.type);

    const Renderer = getRenderer(component.type);

    const renderChild = (child: any) => (
        <CanvasComponentRenderer
            key={child.id}
            component={child}
            index={component.children?.findIndex(c => c.id === child.id) ?? 0}
            parentId={component.id}
            builderContext={builderContext}
            theme={theme}
            activeThemeObject={activeThemeObject}
            canvasTheme={canvasTheme}
            parentFlexDirection={(component.props as any).flexDirection}
        />
    );

    // COMPUTE MERGE PROPS FOR INHERITANCE
    const isAccent = component.type === 'button';
    // const activeMode = canvasTheme.bg === '#1e1e1e' ? 'dark' : 'light';
    // const activeTheme = builderContext.bodySettings?.theme?.[activeMode] || {};

    const themeDefaults = {
        ...(activeThemeObject?.styles || {}),
        backgroundColor: isAccent ? activeThemeObject?.styles?.primaryColor : activeThemeObject?.styles?.backgroundColor,
        // Use 'color' key for generic merging but prioritize 'textColor' from settings
        color: activeThemeObject?.styles?.textColor || activeThemeObject?.styles?.color,
        textColor: activeThemeObject?.styles?.textColor,
        linkColor: activeThemeObject?.styles?.linkColor,
    };

    // Merge props: Global Defaults -> Parent Inherited -> Component Manual
    const mergedProps = getMergedProps(component.id, builderContext.components, themeDefaults, getDefaultProps);

    // Resolve final text color priority: Manual Prop > Inherited textColor > Inherited color > Theme Default
    const effectiveTextColor =
        component.props.textColor ||
        component.props.color ||
        mergedProps.textColor ||
        mergedProps.color ||
        canvasTheme.text;

    // Inject effective color back into props for renderers that might check either key
    mergedProps.color = effectiveTextColor;
    mergedProps.textColor = effectiveTextColor;

    const commonStyles = extractCommonStyles(mergedProps);

    const renderComponent = () => {
        let content: React.ReactNode;

        if (!isContainer) {
            if (Renderer) {
                content = (
                    <Renderer
                        component={{ ...component, props: mergedProps }}
                        canvasTheme={canvasTheme}
                        commonStyles={commonStyles}
                        uiTheme={theme}
                        isPreviewMode={false}
                        renderChild={renderChild}
                    />
                );
            } else {
                content = <div>Unknown Component: {component.type}</div>;
            }
        } else {
            const CustomRenderer = customContainerRegistry.getRenderer(component.type);
            if (CustomRenderer) {
                content = (
                    <CustomRenderer
                        component={{ ...component, props: mergedProps }}
                        canvasTheme={canvasTheme}
                        commonStyles={commonStyles}
                        uiTheme={theme}
                        activeThemeObject={activeThemeObject}
                        isPreviewMode={false}
                        renderChild={renderChild}
                        builderContext={builderContext}
                    />
                );
            } else {
                switch (component.type) {
                    case 'columns':
                        content = (
                            <ContainerDroppable
                                containerId={component.id}
                                containerType={component.type}
                                children={component.children || []}
                                builderContext={builderContext}
                                theme={theme}
                                activeThemeObject={activeThemeObject}
                                canvasTheme={canvasTheme}
                                style={{
                                    ...commonStyles,
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${(mergedProps.columns as number) || 2}, 1fr)`,
                                    gap: (mergedProps.gap as string) || '16px',
                                    minHeight: (commonStyles as any).minHeight || '50px',
                                    border: ((commonStyles as any).borderWidth || (mergedProps.backgroundColor && mergedProps.backgroundColor !== 'transparent')) ? undefined : `1px dashed ${canvasTheme.text}20`
                                }}
                                emptyContent={null}
                            />
                        );
                        break;

                    default:
                        content = (
                            <ContainerDroppable
                                containerId={component.id}
                                containerType={component.type}
                                children={component.children || []}
                                builderContext={builderContext}
                                theme={theme}
                                activeThemeObject={activeThemeObject}
                                canvasTheme={canvasTheme}
                                style={{
                                    ...commonStyles,
                                    minHeight: (commonStyles as any).minHeight || '50px',
                                    border: ((commonStyles as any).borderWidth || (mergedProps.backgroundColor && mergedProps.backgroundColor !== 'transparent')) ? undefined : `1px dashed ${canvasTheme.text}20`
                                }}
                                emptyContent={
                                    <span style={{ color: canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
                                        {component.type}
                                    </span>
                                }
                            />
                        );
                        break;
                }
            }
        }

        // Wrap with placeholder styling if flagged
        if (component.props.isPlaceholder) {
            return (
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 20,
                            border: '2px dashed #3b82f6',
                            backgroundColor: '#3b82f620',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: 600,
                            pointerEvents: 'none',
                        }}
                    >
                        Drop Here
                    </div>
                    <div style={{ opacity: 0.4 }}>{content}</div>
                </div>
            );
        }

        return content;
    };

    const wrapperStyle: React.CSSProperties = {
        opacity: isDragging ? 0.3 : 1,
        cursor: 'move',
        position: 'relative',
        outline: (isSelected || isHovered) ? `2px solid ${theme.primary}` : undefined,
        outlineOffset: '-2px',
        zIndex: (isSelected || isHovered) ? 10 : undefined,
    };

    return (
        <div
            ref={ref}
            style={wrapperStyle}
            onClick={(e) => {
                e.stopPropagation();
                selectComponent(component.id);
            }}
            onMouseEnter={(e) => {
                e.stopPropagation();
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            data-handler-id={handlerId}
            id={`component-${component.id}`}
            className={`canvas-component-wrapper group ${isDragging ? 'is-dragging' : ''}`}
        >
            {renderComponent()}
        </div>
    );
};
