import React, { useState, useCallback, useRef, createContext, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragTypes } from './types/dnd-types';
import type { ItemType, Item, Container, ContainerRules, DragStyle } from './types/dnd-types';
import { generateId } from './types/component-types';

interface DragItemObject {
  id: string;
  index: number;
  parentId: string;
  entity: Item;
  itemType: ItemType;
  type?: string; // For NEW_COMPONENT
  componentDef?: any; // For NEW_COMPONENT
}

interface DragContainerObject {
  id: string;
  index: number;
  parentId: string | null;
  containerType: string;
  entity: Container;
  type?: string;
}

// ... (imports remain)

// ... (in DeepNestedContainersDemo body)



// ============================================================================
// CONTEXT
// ============================================================================

interface ContainerContextValue {
  moveEntity: (entityId: string, sourceId: string | null, targetId: string, targetIndex: number) => void;
  canAccept: (container: Container, entity: Container | Item) => boolean;
  toggleCollapse: (containerId: string) => void;
  findParentId: (entityId: string) => string | null;
  getContainer: (containerId: string) => Container | null;
  dragStyle: 'indicator' | 'kanban';
  handleNewItem: (componentDef: any, targetId: string, index: number) => void;
}

const ContainerContext = createContext<ContainerContextValue | null>(null);

// ============================================================================
// ITEM RENDERERS
// ============================================================================

const TrackItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex-item flex-item--track">
    <span className="flex-item-icon">♪</span>
    <span className="flex-item-title">{item.data.title as string}</span>
    <span className="flex-item-meta">{item.data.duration as string}</span>
  </div>
);

const PhotoItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex-item flex-item--photo" style={{ background: item.data.color as string }}>
    <span className="flex-item-emoji">{item.data.emoji as string}</span>
  </div>
);

const TaskItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className={`flex-item flex-item--task ${item.data.done ? 'flex-item--done' : ''}`}>
    <span className="flex-item-check">{item.data.done ? '✓' : '○'}</span>
    <span className="flex-item-title">{item.data.text as string}</span>
  </div>
);

const FileItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex-item flex-item--file">
    <span className="flex-item-icon">📄</span>
    <span className="flex-item-title">{item.data.name as string}</span>
  </div>
);

const NoteItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex-item flex-item--note">
    <span className="flex-item-icon">📝</span>
    <span className="flex-item-title">{item.data.title as string}</span>
  </div>
);

const GenericRenderer: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex-item flex-item--generic">
    <span className="flex-item-icon">🧩</span>
    <span className="flex-item-title">{item.data.label as string || item.itemType}</span>
    <span className="flex-item-meta">{item.data.description as string}</span>
  </div>
);

// Fallback logic in component below instead of hardcoded map for every builder type
const ItemRenderers: Record<string, React.FC<{ item: Item }>> = {
  track: TrackItem,
  photo: PhotoItem,
  task: TaskItem,
  file: FileItem,
  note: NoteItem,
  // Mapping builder types to GenericRenderer for now
};

const getItemRenderer = (type: string) => {
  return ItemRenderers[type] || GenericRenderer;
};

// ============================================================================
// DRAGGABLE ITEM
// ============================================================================

interface DraggableItemProps {
  item: Item;
  index: number;
  parentId: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, parentId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(ContainerContext)!;
  const isKanban = ctx.dragStyle === 'kanban';

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.ITEM,
    item: () => ({ id: item.id, index, parentId, itemType: item.itemType, entity: item }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItemObject,
    unknown,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: DragTypes.ITEM,
    canDrop: (draggedItem) => {
      if (draggedItem.id === item.id) return false;
      // Same container - always allow (reordering)
      if (draggedItem.parentId === parentId) return true;
      // Cross-container - check rules
      const targetContainer = ctx.getContainer(parentId);
      return targetContainer ? ctx.canAccept(targetContainer, draggedItem.entity) : false;
    },
    hover: (draggedItem, monitor) => {
      if (!ref.current || draggedItem.id === item.id) return;

      // Check if cross-container move is allowed
      if (draggedItem.parentId !== parentId) {
        const targetContainer = ctx.getContainer(parentId);
        if (!targetContainer || !ctx.canAccept(targetContainer, draggedItem.entity)) {
          return; // Don't do anything if move is not allowed
        }
      }

      // For kanban style: do live reordering for both same and cross-container
      // For indicator style: only do live reordering within same container
      if (isKanban || draggedItem.parentId === parentId) {
        const dragIndex = draggedItem.index;
        const hoverIndex = index;

        // For cross-container in kanban mode, always allow the move
        if (draggedItem.parentId === parentId && dragIndex === hoverIndex) return;

        const rect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (rect.bottom - rect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientY = clientOffset.y - rect.top;

        if (draggedItem.parentId === parentId) {
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        }

        // In kanban mode, do live move for cross-container too
        if (isKanban && draggedItem.parentId !== parentId) {
          ctx.moveEntity(draggedItem.id, draggedItem.parentId, parentId, hoverIndex);
          draggedItem.parentId = parentId;
          draggedItem.index = hoverIndex;
        } else if (draggedItem.parentId === parentId) {
          ctx.moveEntity(draggedItem.id, parentId, parentId, hoverIndex);
          draggedItem.index = hoverIndex;
        }
      }
    },
    // For indicator style cross-container drops, handle in drop (not hover)
    drop: (draggedItem, monitor) => {
      if (monitor.didDrop()) return;
      if (draggedItem.id === item.id) return;
      // Cross-container move (indicator style only - kanban handles in hover)
      if (!isKanban && draggedItem.parentId !== parentId) {
        const targetContainer = ctx.getContainer(parentId);
        if (targetContainer && ctx.canAccept(targetContainer, draggedItem.entity)) {
          ctx.moveEntity(draggedItem.id, draggedItem.parentId, parentId, index);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));
  const Renderer = getItemRenderer(item.itemType);

  // Different visual feedback based on style
  const getDropClass = () => {
    if (!isOver) return '';
    if (!canDrop) return 'cannot-drop';
    return isKanban ? 'kanban-hover' : 'can-drop';
  };

  return (
    <div ref={ref} className={`flex-item-wrapper ${isDragging ? 'is-dragging' : ''} ${isKanban && isDragging ? 'kanban-dragging' : ''} ${getDropClass()}`}>
      <Renderer item={item} />
    </div>
  );
};

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

interface FlexContainerProps {
  container: Container;
  index: number;
  parentId: string | null;
  depth: number;
}

const FlexContainer: React.FC<FlexContainerProps> = ({ container, index, parentId, depth }) => {
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctx = useContext(ContainerContext)!;

  const [{ isDragging }, drag, preview] = useDrag({
    type: DragTypes.CONTAINER,
    item: () => ({ id: container.id, index, parentId, containerType: container.containerType, entity: container }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Reorder containers within same parent
  const [{ isOverContainer }, dropContainer] = useDrop<
    DragContainerObject,
    unknown,
    { isOverContainer: boolean }
  >({
    accept: DragTypes.CONTAINER,
    hover: (draggedItem, monitor) => {
      if (!ref.current || draggedItem.id === container.id) return;
      if (draggedItem.parentId !== parentId) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const rect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - rect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Handle reordering at root level (parentId is null)
      const moveTargetId = parentId === null ? '__root__' : parentId;
      ctx.moveEntity(draggedItem.id, parentId, moveTargetId, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({ isOverContainer: monitor.isOver({ shallow: true }) }),
  });

  // Accept drops INTO this container
  const [{ isOverContent, canDrop }, dropContent] = useDrop<
    DragItemObject | DragContainerObject,
    unknown,
    { isOverContent: boolean; canDrop: boolean }
  >({
    accept: [DragTypes.ITEM, DragTypes.CONTAINER, DragTypes.NEW_COMPONENT],
    canDrop: (draggedItem) => {
      // Allow new components
      if (draggedItem.type === 'NEW_COMPONENT') return true;
      if (!draggedItem.id || !draggedItem.entity) return false;

      if (draggedItem.id === container.id) return false;
      if (isDescendant(container, draggedItem.id)) return false;
      return ctx.canAccept(container, draggedItem.entity);
    },
    drop: (draggedItem, monitor) => {
      if (monitor.didDrop()) return;

      if (draggedItem.type === 'NEW_COMPONENT' && 'componentDef' in draggedItem) {
        ctx.handleNewItem(draggedItem.componentDef, container.id, container.children.length);
        return;
      }

      if (draggedItem.id && draggedItem.parentId !== undefined) {
        // Safe to use parentId here because if it was null, moveEntity handles it? 
        // Actually moveEntity wants sourceId string|null.
        ctx.moveEntity(draggedItem.id, draggedItem.parentId, container.id, container.children.length);
      }
    },
    collect: (monitor) => ({
      isOverContent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  preview(dropContainer(ref));
  drag(headerRef);
  dropContent(contentRef);

  const itemCount = container.children.filter(c => c.entityType === 'item').length;
  const containerCount = container.children.filter(c => c.entityType === 'container').length;

  return (
    <div
      ref={ref}
      className={`flex-container-wrapper depth-${Math.min(depth, 4)} ${isDragging ? 'is-dragging' : ''} ${isOverContainer ? 'is-over' : ''}`}
    >
      <div className={`flex-container ${isOverContent && canDrop ? 'can-drop' : ''} ${isOverContent && !canDrop ? 'cannot-drop' : ''}`}>
        <div ref={headerRef} className="flex-container-header">
          <button className="flex-container-collapse" onClick={() => ctx.toggleCollapse(container.id)}>
            {container.collapsed ? '▶' : '▼'}
          </button>
          <span className="flex-container-label">{container.label}</span>
          <span className="flex-container-type">{container.containerType}</span>
          {(containerCount > 0 || itemCount > 0) && (
            <span className="flex-container-count">
              {containerCount > 0 && `${containerCount}📦`}
              {itemCount > 0 && ` ${itemCount}`}
            </span>
          )}
        </div>

        {!container.collapsed && (
          <div ref={contentRef} className="flex-container-content">
            {container.children.map((child, i) =>
              child.entityType === 'container' ? (
                <FlexContainer key={child.id} container={child as Container} index={i} parentId={container.id} depth={depth + 1} />
              ) : (
                <DraggableItem key={child.id} item={child as Item} index={i} parentId={container.id} />
              )
            )}
            {container.children.length === 0 && (
              <div className="flex-container-empty">Drop here</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function isDescendant(container: Container, targetId: string): boolean {
  for (const child of container.children) {
    if (child.id === targetId) return true;
    if (child.entityType === 'container' && isDescendant(child as Container, targetId)) return true;
  }
  return false;
}

// ============================================================================
// ROOT CONTAINER
// ============================================================================

interface RootContainerProps {
  containers: Container[];
  onMove: (entityId: string, sourceId: string | null, targetId: string, targetIndex: number) => void;
  onToggle: (containerId: string) => void;
  findParent: (entityId: string) => string | null;
  findContainer: (containerId: string) => Container | null;
  dragStyle: 'indicator' | 'kanban';
  handleNewItem: (componentDef: any, targetId: string, index: number) => void;
}

const RootContainer: React.FC<RootContainerProps> = ({ containers, onMove, onToggle, findParent, findContainer, dragStyle, handleNewItem }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const canAccept = useCallback((container: Container, entity: Container | Item): boolean => {
    if (entity.entityType === 'item') {
      if (!container.rules.allowItems) return false;
      if (container.rules.allowedItemTypes === 'all') return true;
      return container.rules.allowedItemTypes.includes((entity as Item).itemType);
    } else {
      if (!container.rules.allowContainers) return false;
      if (container.rules.allowedContainerTypes === 'all') return true;
      return container.rules.allowedContainerTypes.includes((entity as Container).containerType);
    }
  }, []);

  const [{ isOver }, drop] = useDrop({
    accept: DragTypes.CONTAINER,
    drop: (draggedItem: { id: string; parentId: string | null }, monitor) => {
      if (monitor.didDrop()) return;
      if (draggedItem.parentId === null) return;
      onMove(draggedItem.id, draggedItem.parentId, '__root__', containers.length);
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  drop(rootRef);

  const contextValue: ContainerContextValue = {
    moveEntity: onMove,
    canAccept,
    toggleCollapse: onToggle,
    findParentId: findParent,
    getContainer: findContainer,
    dragStyle,
    handleNewItem,
  };

  return (
    <ContainerContext.Provider value={contextValue}>
      <div ref={rootRef} className={`flex-root ${isOver ? 'is-over' : ''}`}>
        {containers.map((container, index) => (
          <FlexContainer key={container.id} container={container} index={index} parentId={null} depth={0} />
        ))}
      </div>
    </ContainerContext.Provider>
  );
};

// ============================================================================
// INITIAL DATA
// ============================================================================

const playlistRules: ContainerRules = { allowedItemTypes: ['track'], allowedContainerTypes: [], allowContainers: false, allowItems: true };
const taskListRules: ContainerRules = { allowedItemTypes: ['task'], allowedContainerTypes: ['taskList'], allowContainers: true, allowItems: true };
const albumRules: ContainerRules = { allowedItemTypes: ['photo'], allowedContainerTypes: ['album'], allowContainers: true, allowItems: true };
const folderRules: ContainerRules = { allowedItemTypes: ['file', 'note'], allowedContainerTypes: ['folder'], allowContainers: true, allowItems: true };
const workspaceRules: ContainerRules = { allowedItemTypes: [], allowedContainerTypes: 'all', allowContainers: true, allowItems: false };
const bucketRules: ContainerRules = { allowedItemTypes: 'all', allowedContainerTypes: 'all', allowContainers: true, allowItems: true };

const item = (id: string, itemType: ItemType, data: Record<string, unknown>): Item => ({ id, entityType: 'item', itemType, data });
const cont = (id: string, containerType: string, label: string, rules: ContainerRules, children: (Container | Item)[] = []): Container =>
  ({ id, entityType: 'container', containerType, label, rules, children });

const initialData: Container[] = [
  cont('ws1', 'workspace', 'Music & Media', workspaceRules, [
    cont('pl1', 'playlist', 'Morning Mix', playlistRules, [
      item('t1', 'track', { title: 'Sunrise', duration: '3:24' }),
      item('t2', 'track', { title: 'Coffee Jazz', duration: '4:12' }),
      item('t3', 'track', { title: 'Wake Up', duration: '2:58' }),
    ]),
    cont('pl2', 'playlist', 'Focus', playlistRules, [
      item('t4', 'track', { title: 'Deep Work', duration: '6:30' }),
      item('t5', 'track', { title: 'Flow State', duration: '5:15' }),
    ]),
    cont('album1', 'album', 'Vacation', albumRules, [
      item('p1', 'photo', { color: '#06b6d4', emoji: '🏖️' }),
      item('p2', 'photo', { color: '#3b82f6', emoji: '🌊' }),
      item('p3', 'photo', { color: '#f97316', emoji: '🌅' }),
    ]),
  ]),
  cont('ws2', 'workspace', 'Projects', workspaceRules, [
    cont('tl1', 'taskList', 'Sprint 1', taskListRules, [
      cont('tl1a', 'taskList', 'Frontend', taskListRules, [
        item('task1', 'task', { text: 'Build UI', done: true }),
        item('task2', 'task', { text: 'Add animations', done: false }),
      ]),
      cont('tl1b', 'taskList', 'Backend', taskListRules, [
        item('task3', 'task', { text: 'Setup API', done: true }),
        item('task4', 'task', { text: 'Database', done: false }),
      ]),
    ]),
    cont('tl2', 'taskList', 'Backlog', taskListRules, [
      item('task5', 'task', { text: 'Documentation', done: false }),
      item('task6', 'task', { text: 'Testing', done: false }),
    ]),
  ]),
  cont('ws3', 'workspace', 'Files', workspaceRules, [
    cont('f1', 'folder', 'Documents', folderRules, [
      cont('f1a', 'folder', 'Work', folderRules, [
        item('file1', 'file', { name: 'report.pdf' }),
        item('note1', 'note', { title: 'Meeting notes' }),
      ]),
      item('file2', 'file', { name: 'resume.docx' }),
    ]),
  ]),
  cont('bucket', 'bucket', 'Everything Bucket', bucketRules, [
    item('b1', 'track', { title: 'Random Song', duration: '3:00' }),
    item('b2', 'task', { text: 'Random Task', done: false }),
    item('b3', 'photo', { color: '#a855f7', emoji: '❓' }),
  ]),
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DeepNestedContainersDemo: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>(initialData);
  const [dragStyle, setDragStyle] = useState<DragStyle>('indicator');

  const findParentId = useCallback((entityId: string): string | null => {
    const search = (nodes: (Container | Item)[], parentId: string | null): string | null => {
      for (const node of nodes) {
        if (node.id === entityId) return parentId;
        if (node.entityType === 'container') {
          const found = search((node as Container).children, node.id);
          if (found !== undefined) return found;
        }
      }
      return undefined as unknown as string | null;
    };
    const result = search(containers, null);
    return result === undefined ? null : result;
  }, [containers]);

  const findContainer = useCallback((containerId: string): Container | null => {
    const search = (nodes: (Container | Item)[]): Container | null => {
      for (const node of nodes) {
        if (node.entityType === 'container') {
          if (node.id === containerId) return node as Container;
          const found = search((node as Container).children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(containers);
  }, [containers]);

  const findAndRemove = useCallback((tree: (Container | Item)[], entityId: string): { tree: (Container | Item)[]; entity: Container | Item | null } => {
    const newTree: (Container | Item)[] = [];
    let found: Container | Item | null = null;

    for (const node of tree) {
      if (node.id === entityId) {
        found = node;
        continue;
      }
      if (node.entityType === 'container') {
        const result = findAndRemove((node as Container).children, entityId);
        if (result.entity) {
          found = result.entity;
          newTree.push({ ...node, children: result.tree } as Container);
        } else {
          newTree.push(node);
        }
      } else {
        newTree.push(node);
      }
    }
    return { tree: newTree, entity: found };
  }, []);

  const insertIntoTree = useCallback((tree: (Container | Item)[], targetId: string, entity: Container | Item, index: number): { tree: (Container | Item)[]; inserted: boolean } => {
    let inserted = false;
    const newTree = tree.map(node => {
      if (node.id === targetId && node.entityType === 'container') {
        const newChildren = [...(node as Container).children];
        newChildren.splice(index, 0, entity);
        inserted = true;
        return { ...node, children: newChildren };
      }
      if (node.entityType === 'container') {
        const result = insertIntoTree((node as Container).children, targetId, entity, index);
        if (result.inserted) {
          inserted = true;
          return { ...node, children: result.tree };
        }
      }
      return node;
    });
    return { tree: newTree, inserted };
  }, []);

  const moveEntity = useCallback((entityId: string, _sourceId: string | null, targetId: string, targetIndex: number) => {
    setContainers(prev => {
      // Always search the entire tree to find and remove the entity
      // This handles cases where parentId in drag item becomes stale
      const removeResult = findAndRemove(prev, entityId);
      const entity = removeResult.entity;
      const treeWithoutEntity = removeResult.tree;

      if (!entity) return prev;

      if (targetId === '__root__') {
        (treeWithoutEntity as Container[]).splice(targetIndex, 0, entity as Container);
        return treeWithoutEntity as Container[];
      } else {
        const insertResult = insertIntoTree(treeWithoutEntity, targetId, entity, targetIndex);
        // If insertion failed (target not found), restore the original state
        if (!insertResult.inserted) return prev;
        return insertResult.tree as Container[];
      }
    });
  }, [findAndRemove, insertIntoTree]);

  const toggleCollapse = useCallback((containerId: string) => {
    const toggle = (tree: (Container | Item)[]): (Container | Item)[] => {
      return tree.map(node => {
        if (node.id === containerId && node.entityType === 'container') {
          return { ...node, collapsed: !(node as Container).collapsed };
        }
        if (node.entityType === 'container') {
          return { ...node, children: toggle((node as Container).children) };
        }
        return node;
      });
    };
    setContainers(prev => toggle(prev) as Container[]);
  }, []);

  const handleNewItem = useCallback((componentDef: any, targetId: string, index: number) => {
    // Determine if this component should be a container
    const containerTypes = ['container', 'section', 'card', 'columns', 'form', 'taskList', 'folder', 'workspace', 'playlist', 'album', 'bucket'];
    const isContainer = containerTypes.includes(componentDef.type);

    let newItem: Container | Item;

    if (isContainer) {
      newItem = {
        id: generateId(),
        entityType: 'container',
        containerType: componentDef.type,
        label: componentDef.label || 'Container',
        rules: { allowedItemTypes: 'all', allowedContainerTypes: 'all', allowContainers: true, allowItems: true }, // Default permissive rules
        children: [],
        collapsed: false
      };
    } else {
      newItem = {
        id: generateId(),
        entityType: 'item',
        itemType: componentDef.type,
        data: { ...componentDef },
      };
    }

    setContainers(prev => {
      if (targetId === '__root__') {
        const newContainers = [...prev];
        // Root only accepts containers usually, but our interface says Container | Item? 
        // RootContainer expects Container[].
        if (newItem.entityType === 'container') {
          newContainers.splice(index, 0, newItem);
          return newContainers;
        } else {
          // If we try to drop an item at root, but root only supports containers
          // We might need to wrap it or reject. 
          // For now, let's allow it if we change RootContainer types, 
          // BUT RootContainer props says containers: Container[].
          // So check logic.
          // If dropping item at root, maybe wrap in a default container?
          // Or just alert logic failure.
          console.warn("Cannot drop item at root level");
          return prev;
        }
      } else {
        const insertResult = insertIntoTree(prev, targetId, newItem, index);
        if (!insertResult.inserted) return prev;
        return insertResult.tree as Container[];
      }
    });
  }, [insertIntoTree]);

  // Removed redundant contextValue creation as RootContainer handles it

  return (
    <div className="flex-nested-demo">
      <div className="flex-controls">
        <div className="flex-rules-legend">
          <div className="flex-rules-title">Container Rules:</div>
          <div className="flex-rules-grid">
            <div className="flex-rule"><span className="flex-rule-type">playlist</span> tracks only</div>
            <div className="flex-rule"><span className="flex-rule-type">album</span> photos, nested albums</div>
            <div className="flex-rule"><span className="flex-rule-type">taskList</span> tasks, nested tasklists</div>
            <div className="flex-rule"><span className="flex-rule-type">folder</span> files, notes, nested folders</div>
            <div className="flex-rule"><span className="flex-rule-type">workspace</span> any container (no items)</div>
            <div className="flex-rule"><span className="flex-rule-type">bucket</span> anything!</div>
          </div>
        </div>
        <div className="flex-style-toggle">
          <span className="flex-style-label">Drag Style:</span>
          <div className="flex-style-buttons">
            <button
              className={`flex-style-btn ${dragStyle === 'indicator' ? 'active' : ''}`}
              onClick={() => setDragStyle('indicator')}
            >
              Indicator
            </button>
            <button
              className={`flex-style-btn ${dragStyle === 'kanban' ? 'active' : ''}`}
              onClick={() => setDragStyle('kanban')}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>
      <RootContainer
        containers={containers}
        onMove={moveEntity}
        onToggle={toggleCollapse}
        findParent={findParentId}
        findContainer={findContainer}
        dragStyle={dragStyle}
        handleNewItem={handleNewItem}
      />
    </div>
  );
};

export default DeepNestedContainersDemo;
