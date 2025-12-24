import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DragTypes } from '../../types/dnd-types';
import type { CanvasComponent } from '../../types/component-types';
import type { Theme as UITheme } from '../panels/property-panel/theme';
import type { Theme } from '../../types/theme';
import type { CanvasTheme } from '../../components/canvas-components/types';
import { CanvasComponentRenderer } from './CanvasComponentRenderer';
import { validationRegistry } from '../../registries/validation-registry';

interface ContainerDroppableProps {
    containerId: string;
    containerType: string; // Added validation prop
    children: CanvasComponent[];
    builderContext: any;
    theme: UITheme;
    activeThemeObject?: Theme;
    canvasTheme: CanvasTheme;
    style?: React.CSSProperties;
    className?: string;
    emptyContent?: React.ReactNode;
}

export const ContainerDroppable: React.FC<ContainerDroppableProps> = ({
    containerId,
    containerType,
    children,
    builderContext,
    theme,
    activeThemeObject,
    canvasTheme,
    style,
    className,
    emptyContent
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { moveComponent, addComponent } = builderContext;

    const [{ isOver, canDrop, isStart, isEnd, isRow }, drop] = useDrop({
        accept: [DragTypes.ITEM, DragTypes.CONTAINER, DragTypes.NEW_COMPONENT],
        canDrop: (item: any) => {
            // Prevent dropping into itself
            if (item.id === containerId) return false;

            // Check validation rules
            const childType = item.type === DragTypes.NEW_COMPONENT ? item.componentDef.type : item.type;
            return validationRegistry.canDrop(containerType, childType);
        },
        drop: (item: any, monitor) => {
            if (monitor.didDrop()) return;

            // Finalize component (remove placeholder flag)
            if (item.id && (item as any).isInstantiated) {
                builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
            }

            const targetIndex = (item as any).index ?? children.length; // Use calculated index if available

            if (item.type === 'NEW_COMPONENT') {
                if (item.isInstantiated) return;
                addComponent(item.componentDef, containerId, targetIndex);
                return;
            }

            if (item.id) {
                moveComponent(item.id, item.parentId, containerId, (item as any).index ?? children.length);
            }
        },
        hover: (item: any, monitor) => {
            if (!monitor.isOver({ shallow: true })) return;
            if (!monitor.canDrop()) return;

            const hoverBoundingRect = (ref.current as any).getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const isRowLocal = (style as any)?.flexDirection === 'row' || activeThemeObject?.styles?.flexDirection === 'row';

            let isStartLocal = false;
            let isEndLocal = false;

            if (isRowLocal) {
                const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;
                isStartLocal = hoverClientX < hoverBoundingRect.width * 0.2;
                isEndLocal = hoverClientX > hoverBoundingRect.width * 0.8;
            } else {
                const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
                isStartLocal = hoverClientY < hoverBoundingRect.height * 0.3;
                isEndLocal = hoverClientY > hoverBoundingRect.height * 0.7;
            }

            const targetIndex = isStartLocal ? 0 : children.length;
            const isNew = item.type === DragTypes.NEW_COMPONENT;
            const isCrossParent = item.parentId !== containerId;
            const isExtreme = isStartLocal || isEndLocal;

            if (isNew || isCrossParent) {
                if (isNew && item.isInstantiated && item.id) {
                    if (item.parentId === containerId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, containerId, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = containerId;
                    return;
                }

                if (isNew) {
                    const newId = builderContext.addComponent(
                        { ...item.componentDef, props: { ...item.componentDef.props, isPlaceholder: isExtreme } },
                        containerId,
                        targetIndex
                    );
                    item.isInstantiated = true;
                    item.id = newId;
                    item.index = targetIndex;
                    item.parentId = containerId;
                    return;
                }

                // Cross-parent move to this container
                if (item.id) {
                    if (item.parentId === containerId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, containerId, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = containerId;
                }
            } else {
                // Internal reorder (no placeholder)
                if (item.id) {
                    if (item.parentId === containerId && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, containerId, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
                    item.index = targetIndex;
                    item.parentId = containerId;
                }
            }
        },
        collect: (monitor) => {
            const isOverLocal = monitor.isOver({ shallow: true });
            const item = monitor.getItem();
            const clientOffset = monitor.getClientOffset();
            let isStartLocal = false;
            let isEndLocal = false;

            if (isOverLocal && clientOffset && ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const isRowLocal = (style as any)?.flexDirection === 'row' || activeThemeObject?.styles?.flexDirection === 'row';

                if (isRowLocal) {
                    const x = clientOffset.x - rect.left;
                    isStartLocal = x < rect.width * 0.2;
                    isEndLocal = x > rect.width * 0.8;
                } else {
                    const y = clientOffset.y - rect.top;
                    isStartLocal = y < rect.height * 0.3;
                    isEndLocal = y > rect.height * 0.7;
                }
            }

            return {
                isOver: isOverLocal,
                canDrop: monitor.canDrop(),
                isStart: isStartLocal,
                isEnd: isEndLocal,
                isRow: (style as any)?.flexDirection === 'row' || activeThemeObject?.styles?.flexDirection === 'row'
            };
        },
    });

    drop(ref);

    const isActive = isOver && canDrop;
    const isRejected = isOver && !canDrop;

    return (
        <div
            ref={ref}
            className={`${className || ''} ${isActive ? 'ring-2 ring-blue-400 bg-blue-50/10' : ''} ${isRejected ? 'ring-2 ring-red-400 bg-red-50/10 cursor-no-drop' : ''}`}
            style={{
                ...style,
                transition: 'background-color 0.2s, box-shadow 0.2s, padding 0.2s ease',
                minHeight: children.length === 0 ? '60px' : undefined,
                // Adaptive padding: merge existing styles with dynamic expansion
                paddingTop: (isOver && !isRow && isStart ? 60 : (style?.paddingTop || style?.padding || activeThemeObject?.styles?.paddingTop || activeThemeObject?.styles?.padding || 0)) as any,
                paddingBottom: (isOver && !isRow && isEnd ? 60 : (style?.paddingBottom || style?.padding || activeThemeObject?.styles?.paddingBottom || activeThemeObject?.styles?.padding || 0)) as any,
                paddingLeft: (isOver && isRow && isStart ? 60 : (style?.paddingLeft || style?.padding || activeThemeObject?.styles?.paddingLeft || activeThemeObject?.styles?.padding || 0)) as any,
                paddingRight: (isOver && isRow && isEnd ? 60 : (style?.paddingRight || style?.padding || activeThemeObject?.styles?.paddingRight || activeThemeObject?.styles?.padding || 0)) as any,
            }}
        >
            {children.map((child, i) => (
                <CanvasComponentRenderer
                    key={child.id}
                    component={child}
                    index={i}
                    parentId={containerId}
                    builderContext={builderContext}
                    theme={theme}
                    activeThemeObject={activeThemeObject}
                    canvasTheme={canvasTheme}
                    parentFlexDirection={(style as any)?.flexDirection || activeThemeObject?.styles?.flexDirection || 'column'}
                />
            ))}

            {children.length === 0 && emptyContent && (
                <div style={{ pointerEvents: 'none' }}>{emptyContent}</div>
            )}
        </div>
    );
};
