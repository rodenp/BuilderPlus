import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { CanvasComponent } from '../../types/component-types';
import type { Theme as UITheme } from '../panels/property-panel/theme';
import type { Theme } from '../../types/theme';
import { DragTypes } from '../../types/dnd-types';
import { getRenderer, getDefaultProps } from '../../components/canvas-components/register';
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
    activeThemeObject: Theme;
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
    });

    // DROP logic
    const [{ handlerId }, drop] = useDrop({
        accept: [DragTypes.ITEM, DragTypes.NEW_COMPONENT],
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        hover(item: any, monitor) {
            if (!ref.current) return;
            if (!monitor.isOver({ shallow: true })) return;

            const dragIndex = item.index;
            const hoverIndex = index;
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;

            const isHorizontal = parentFlexDirection.includes('row');

            if (isHorizontal) {
                if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
                if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
            } else {
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
            }

            if (item.type === DragTypes.NEW_COMPONENT) {
                const newId = builderContext.addComponent(item.componentDef, parentId, hoverIndex);
                item.type = DragTypes.ITEM;
                item.id = newId;
                item.index = hoverIndex;
                item.parentId = parentId;
                return;
            }

            const isDragItem = monitor.getItemType() === DragTypes.ITEM || item.type === DragTypes.ITEM;
            if (isDragItem && item.id !== component.id) {
                if (item.parentId === parentId && dragIndex === hoverIndex) return;
                builderContext.moveComponent(item.id, item.parentId, parentId, hoverIndex);
                item.index = hoverIndex;
                item.parentId = parentId;
            }
        },
    });

    drag(drop(ref));

    const isContainer = customContainerRegistry.isContainer(component.type);
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
        if (!isContainer) {
            if (Renderer) {
                return (
                    <Renderer
                        component={{ ...component, props: mergedProps }}
                        canvasTheme={canvasTheme}
                        commonStyles={commonStyles}
                        uiTheme={theme}
                        isPreviewMode={false}
                        renderChild={renderChild}
                    />
                );
            }
            return <div>Unknown Component: {component.type}</div>;
        }

        const CustomRenderer = customContainerRegistry.getRenderer(component.type);
        if (CustomRenderer) {
            return (
                <CustomRenderer
                    component={{ ...component, props: mergedProps }}
                    canvasTheme={canvasTheme}
                    commonStyles={commonStyles}
                    uiTheme={theme}
                    isPreviewMode={false}
                    renderChild={renderChild}
                    builderContext={builderContext}
                />
            );
        }

        switch (component.type) {
            case 'columns':
                return (
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
                            minHeight: (commonStyles as any).minHeight || '50px'
                        }}
                        emptyContent={null}
                    />
                );

            default:
                return (
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
                            border: (commonStyles as any).borderWidth ? undefined : `1px dashed ${canvasTheme.text}20`
                        }}
                        emptyContent={
                            <span style={{ color: canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
                                {component.type}
                            </span>
                        }
                    />
                );
        }
    };

    const wrapperStyle: React.CSSProperties = {
        opacity: isDragging ? 0.3 : 1,
        cursor: 'move',
        position: 'relative',
        outline: isSelected ? `2px solid ${theme.primary}` : (isHovered ? `1px solid ${theme.primary}` : undefined),
        outlineOffset: '2px',
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
