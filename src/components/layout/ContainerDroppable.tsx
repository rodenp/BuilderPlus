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

    const [{ isOver, canDrop }, drop] = useDrop({
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

            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
            const isTop = hoverClientY < hoverBoundingRect.height * 0.2;
            const isBottom = hoverClientY > hoverBoundingRect.height * 0.8;

            const targetIndex = isTop ? 0 : children.length;
            const isNew = item.type === DragTypes.NEW_COMPONENT;
            const isCrossParent = item.parentId !== containerId;
            const isExtreme = isTop || isBottom;

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
            return {
                isOver: monitor.isOver({ shallow: true }),
                canDrop: monitor.canDrop(),
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
                transition: 'background-color 0.2s, box-shadow 0.2s',
                minHeight: children.length === 0 ? '60px' : undefined,
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
                    parentFlexDirection={(style as any)?.flexDirection}
                />
            ))}

            {children.length === 0 && emptyContent && (
                <div style={{ pointerEvents: 'none' }}>{emptyContent}</div>
            )}
        </div>
    );
};
