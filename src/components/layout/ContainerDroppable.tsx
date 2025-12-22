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
            // Determine the child type. It might be in item.type (for existing items) or item.componentDef.type (for new items)
            const childType = item.type === DragTypes.NEW_COMPONENT ? item.componentDef.type : item.type;

            // Allow if validation registry permits it
            return validationRegistry.canDrop(containerType, childType);
        },
        drop: (item: any, monitor) => {
            if (monitor.didDrop()) return; // Already handled by a nested container

            // Normalize index: append to end
            const targetIndex = children.length;

            if (item.type === 'NEW_COMPONENT') {
                addComponent(item.componentDef, containerId, targetIndex);
                return;
            }

            if (item.id) {
                moveComponent(item.id, item.parentId, containerId, targetIndex);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
        }),
    });

    drop(ref);

    const isActive = isOver && canDrop;

    return (
        <div
            ref={ref}
            className={`${className || ''} ${isActive ? 'ring-2 ring-blue-400 bg-blue-50/10' : ''}`}
            style={{
                ...style,
                // minHeight: children.length === 0 ? '20px' : 'auto', // REMOVED per user request
                transition: 'background-color 0.2s, box-shadow 0.2s',
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
                    parentFlexDirection={(style as any)?.flexDirection} // Pass self direction
                />
            ))}

            {children.length === 0 && emptyContent && (
                <div style={{ pointerEvents: 'none' }}>{emptyContent}</div>
            )}
        </div>
    );
};
