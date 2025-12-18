import React, { useState, useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// ============================================================================
// TYPES
// ============================================================================

export type SectionType = 'mini-playlist' | 'photo-grid' | 'mini-stats' | 'mini-tasks' | 'mini-layers' | 'mini-nav';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
}

export interface NestedTrack {
  id: string;
  title: string;
  duration: string;
}

export interface NestedStat {
  id: string;
  label: string;
  value: string;
  color: string;
}

export interface NestedTask {
  id: string;
  text: string;
  done: boolean;
}

export interface NestedLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: 'shape' | 'text' | 'image' | 'group';
}

export interface NestedNavItem {
  id: string;
  label: string;
  icon: string;
}

export interface PhotoItem {
  id: string;
  color: string;
  label: string;
}

export type SectionData = Record<string, {
  tracks?: NestedTrack[];
  photos?: PhotoItem[];
  stats?: NestedStat[];
  tasks?: NestedTask[];
  layers?: NestedLayer[];
  navItems?: NestedNavItem[];
}>;

export type NestedContainers = Record<string, Section[]>;

// Drag item types
const ItemTypes = {
  SECTION_CARD: 'sectionCard',
  TRACK: 'track',
  PHOTO: 'photo',
  TASK: 'task',
  LAYER: 'layer',
  NAV_ITEM: 'navItem',
};

// ============================================================================
// INITIAL DATA
// ============================================================================

export const initialSectionData: SectionData = {
  's1': {
    tracks: [
      { id: 'nt1', title: 'Morning Jazz', duration: '3:24' },
      { id: 'nt2', title: 'Coffee Break', duration: '4:12' },
      { id: 'nt3', title: 'Sunset Vibes', duration: '5:01' },
    ]
  },
  's2': {
    photos: [
      { id: 'np1', color: '#FF6B6B', label: '1' },
      { id: 'np2', color: '#4ECDC4', label: '2' },
      { id: 'np3', color: '#45B7D1', label: '3' },
      { id: 'np4', color: '#96CEB4', label: '4' },
      { id: 'np5a', color: '#FFEAA7', label: '5' },
      { id: 'np6a', color: '#DDA0DD', label: '6' },
      { id: 'np7a', color: '#98D8C8', label: '7' },
      { id: 'np8a', color: '#F7DC6F', label: '8' },
      { id: 'np9a', color: '#BB8FCE', label: '9' },
    ]
  },
  's3': {
    stats: [
      { id: 'ns1', label: 'Users', value: '1,234', color: '#3b82f6' },
      { id: 'ns2', label: 'Revenue', value: '$5.2k', color: '#22c55e' },
      { id: 'ns3', label: 'Orders', value: '89', color: '#f59e0b' },
    ]
  },
  's4': {
    tasks: [
      { id: 'ntask1', text: 'Review PRs', done: true },
      { id: 'ntask2', text: 'Update docs', done: false },
      { id: 'ntask3', text: 'Deploy v2.0', done: false },
    ]
  },
  's6': {
    tracks: [
      { id: 'nt4', title: 'Deep Focus', duration: '6:30' },
      { id: 'nt5', title: 'Ambient Waves', duration: '4:45' },
    ]
  },
  's7': {
    layers: [
      { id: 'nl1', name: 'Header', visible: true, locked: false, type: 'text' },
      { id: 'nl2', name: 'Background', visible: true, locked: true, type: 'shape' },
      { id: 'nl3', name: 'Logo', visible: true, locked: false, type: 'image' },
      { id: 'nl4', name: 'Footer', visible: false, locked: false, type: 'group' },
    ]
  },
  's8': {
    navItems: [
      { id: 'nn1', label: 'Home', icon: '🏠' },
      { id: 'nn2', label: 'Profile', icon: '👤' },
      { id: 'nn3', label: 'Settings', icon: '⚙️' },
      { id: 'nn4', label: 'Help', icon: '❓' },
    ]
  },
  's9': {
    layers: [
      { id: 'nl5', name: 'Button', visible: true, locked: false, type: 'shape' },
      { id: 'nl6', name: 'Icon', visible: true, locked: false, type: 'image' },
      { id: 'nl7', name: 'Label', visible: true, locked: false, type: 'text' },
    ]
  },
  's10': {
    navItems: [
      { id: 'nn5', label: 'Dashboard', icon: '📊' },
      { id: 'nn6', label: 'Reports', icon: '📋' },
      { id: 'nn7', label: 'Users', icon: '👥' },
    ]
  },
};

export const initialNestedContainers: NestedContainers = {
  'panel-left': [
    { id: 's1', type: 'mini-playlist', title: 'My Playlist' },
    { id: 's7', type: 'mini-layers', title: 'Layers' },
  ],
  'panel-center': [
    { id: 's2', type: 'photo-grid', title: 'Photo Grid' },
    { id: 's4', type: 'mini-tasks', title: 'Task List' },
    { id: 's8', type: 'mini-nav', title: 'Quick Links' },
  ],
  'panel-right': [
    { id: 's9', type: 'mini-layers', title: 'Components' },
    { id: 's10', type: 'mini-nav', title: 'Navigation' },
    { id: 's6', type: 'mini-playlist', title: 'Chill Mix' },
  ],
};

// ============================================================================
// GENERIC SORTABLE ITEM COMPONENT
// ============================================================================

interface SortableItemProps<T extends { id: string }> {
  item: T;
  index: number;
  itemType: string;
  sectionId: string;
  moveItem: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
  children: React.ReactNode;
  className?: string;
}

function SortableItem<T extends { id: string }>({
  item,
  index,
  itemType,
  sectionId,
  moveItem,
  children,
  className = '',
}: SortableItemProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: itemType,
    item: () => ({ id: item.id, index, sectionId }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: itemType,
    hover: (draggedItem: { id: string; index: number; sectionId: string }, monitor) => {
      if (!ref.current) return;
      // Only allow reordering within the same section
      if (draggedItem.sectionId !== sectionId) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex, sectionId);
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${className} ${isDragging ? 'is-dragging' : ''} ${isOver ? 'is-over' : ''}`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SORTABLE INNER COMPONENTS
// ============================================================================

// Sortable Track
const SortableTrack: React.FC<{
  track: NestedTrack;
  index: number;
  sectionId: string;
  moveTrack: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
}> = ({ track, index, sectionId, moveTrack }) => (
  <SortableItem
    item={track}
    index={index}
    itemType={`${ItemTypes.TRACK}-${sectionId}`}
    sectionId={sectionId}
    moveItem={moveTrack}
    className="mini-track-wrapper"
  >
    <div className="mini-track">
      <span className="mini-track-num">{index + 1}</span>
      <span className="mini-track-title">{track.title}</span>
      <span className="mini-track-duration">{track.duration}</span>
    </div>
  </SortableItem>
);

// Sortable Photo
const SortablePhoto: React.FC<{
  photo: PhotoItem;
  index: number;
  sectionId: string;
  movePhoto: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
}> = ({ photo, index, sectionId, movePhoto }) => (
  <SortableItem
    item={photo}
    index={index}
    itemType={`${ItemTypes.PHOTO}-${sectionId}`}
    sectionId={sectionId}
    moveItem={movePhoto}
    className="photo-item-wrapper"
  >
    <div className="photo-card" style={{ backgroundColor: photo.color }}>
      <span className="photo-label">{photo.label}</span>
    </div>
  </SortableItem>
);

// Sortable Task
const SortableTask: React.FC<{
  task: NestedTask;
  index: number;
  sectionId: string;
  moveTask: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
}> = ({ task, index, sectionId, moveTask }) => (
  <SortableItem
    item={task}
    index={index}
    itemType={`${ItemTypes.TASK}-${sectionId}`}
    sectionId={sectionId}
    moveItem={moveTask}
    className="mini-task-wrapper"
  >
    <div className={`mini-task ${task.done ? 'mini-task--done' : ''}`}>
      <span className="mini-task-check">{task.done ? '✓' : '○'}</span>
      <span className="mini-task-text">{task.text}</span>
    </div>
  </SortableItem>
);

// Sortable Layer
const layerIcons: Record<string, string> = { shape: '◼', text: 'T', image: '🖼', group: '📁' };

const SortableLayer: React.FC<{
  layer: NestedLayer;
  index: number;
  sectionId: string;
  moveLayer: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
}> = ({ layer, index, sectionId, moveLayer }) => (
  <SortableItem
    item={layer}
    index={index}
    itemType={`${ItemTypes.LAYER}-${sectionId}`}
    sectionId={sectionId}
    moveItem={moveLayer}
    className="mini-layer-wrapper"
  >
    <div className={`mini-layer ${!layer.visible ? 'mini-layer--hidden' : ''}`}>
      <span className="mini-layer-visibility">{layer.visible ? '👁' : '○'}</span>
      <span className="mini-layer-type">{layerIcons[layer.type]}</span>
      <span className="mini-layer-name">{layer.name}</span>
      <span className="mini-layer-lock">{layer.locked ? '🔒' : ''}</span>
    </div>
  </SortableItem>
);

// Sortable Nav Item
const SortableNavItem: React.FC<{
  navItem: NestedNavItem;
  index: number;
  sectionId: string;
  moveNavItem: (dragIndex: number, hoverIndex: number, sectionId: string) => void;
}> = ({ navItem, index, sectionId, moveNavItem }) => (
  <SortableItem
    item={navItem}
    index={index}
    itemType={`${ItemTypes.NAV_ITEM}-${sectionId}`}
    sectionId={sectionId}
    moveItem={moveNavItem}
    className="mini-nav-item-wrapper"
  >
    <div className="mini-nav-item">
      <span className="mini-nav-icon">{navItem.icon}</span>
      <span className="mini-nav-label">{navItem.label}</span>
    </div>
  </SortableItem>
);

// Static Stats (not sortable)
const MiniStats: React.FC<{ stats: NestedStat[] }> = ({ stats }) => (
  <div className="mini-stats">
    {stats.map(stat => (
      <div key={stat.id} className="mini-stat" style={{ borderLeftColor: stat.color }}>
        <span className="mini-stat-value">{stat.value}</span>
        <span className="mini-stat-label">{stat.label}</span>
      </div>
    ))}
  </div>
);

// ============================================================================
// DRAGGABLE SECTION CARD
// ============================================================================

interface DraggableSectionCardProps {
  section: Section;
  index: number;
  panelId: string;
  sectionData: SectionData;
  moveSection: (dragIndex: number, hoverIndex: number, sourcePanelId: string, targetPanelId: string) => void;
  moveSectionToPanel: (sectionId: string, sourcePanelId: string, targetPanelId: string, targetIndex: number) => void;
  onUpdateTracks: (sectionId: string, tracks: NestedTrack[]) => void;
  onUpdatePhotos: (sectionId: string, photos: PhotoItem[]) => void;
  onUpdateTasks: (sectionId: string, tasks: NestedTask[]) => void;
  onUpdateLayers: (sectionId: string, layers: NestedLayer[]) => void;
  onUpdateNavItems: (sectionId: string, navItems: NestedNavItem[]) => void;
}

const DraggableSectionCard: React.FC<DraggableSectionCardProps> = ({
  section,
  index,
  panelId,
  sectionData,
  moveSection,
  onUpdateTracks,
  onUpdatePhotos,
  onUpdateTasks,
  onUpdateLayers,
  onUpdateNavItems,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const data = sectionData[section.id];

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.SECTION_CARD,
    item: () => ({ id: section.id, index, panelId, section }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.SECTION_CARD,
    hover: (draggedItem: { id: string; index: number; panelId: string }, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const sourcePanelId = draggedItem.panelId;
      const targetPanelId = panelId;

      // Don't replace items with themselves
      if (draggedItem.id === section.id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Same panel reordering
      if (sourcePanelId === targetPanelId) {
        if (dragIndex === hoverIndex) return;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      }

      moveSection(dragIndex, hoverIndex, sourcePanelId, targetPanelId);
      draggedItem.index = hoverIndex;
      draggedItem.panelId = targetPanelId;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Move handlers for inner items
  const moveTrack = useCallback((dragIndex: number, hoverIndex: number, sectionId: string) => {
    const tracks = [...(sectionData[sectionId]?.tracks || [])];
    const [removed] = tracks.splice(dragIndex, 1);
    tracks.splice(hoverIndex, 0, removed);
    onUpdateTracks(sectionId, tracks);
  }, [sectionData, onUpdateTracks]);

  const movePhoto = useCallback((dragIndex: number, hoverIndex: number, sectionId: string) => {
    const photos = [...(sectionData[sectionId]?.photos || [])];
    const [removed] = photos.splice(dragIndex, 1);
    photos.splice(hoverIndex, 0, removed);
    onUpdatePhotos(sectionId, photos);
  }, [sectionData, onUpdatePhotos]);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number, sectionId: string) => {
    const tasks = [...(sectionData[sectionId]?.tasks || [])];
    const [removed] = tasks.splice(dragIndex, 1);
    tasks.splice(hoverIndex, 0, removed);
    onUpdateTasks(sectionId, tasks);
  }, [sectionData, onUpdateTasks]);

  const moveLayer = useCallback((dragIndex: number, hoverIndex: number, sectionId: string) => {
    const layers = [...(sectionData[sectionId]?.layers || [])];
    const [removed] = layers.splice(dragIndex, 1);
    layers.splice(hoverIndex, 0, removed);
    onUpdateLayers(sectionId, layers);
  }, [sectionData, onUpdateLayers]);

  const moveNavItem = useCallback((dragIndex: number, hoverIndex: number, sectionId: string) => {
    const navItems = [...(sectionData[sectionId]?.navItems || [])];
    const [removed] = navItems.splice(dragIndex, 1);
    navItems.splice(hoverIndex, 0, removed);
    onUpdateNavItems(sectionId, navItems);
  }, [sectionData, onUpdateNavItems]);

  // Connect drag to header, drop to entire card
  preview(drop(ref));
  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={ref}
      className={`section-item-wrapper ${isDragging ? 'is-dragging' : ''} ${isOver ? 'is-over' : ''}`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className={`section-card section-card--${section.type}`}>
        <div
          ref={dragRef}
          className="section-card-header"
          style={{ cursor: 'grab' }}
        >
          <span className="section-card-title">{section.title}</span>
          <span className="section-card-type">{section.type.replace('mini-', '').replace('photo-grid', 'photos')}</span>
        </div>
        <div className="section-card-content">
          {section.type === 'mini-playlist' && data?.tracks && (
            <div className="mini-playlist">
              {data.tracks.map((track, i) => (
                <SortableTrack
                  key={track.id}
                  track={track}
                  index={i}
                  sectionId={section.id}
                  moveTrack={moveTrack}
                />
              ))}
            </div>
          )}
          {section.type === 'photo-grid' && data?.photos && (
            <div className="photo-grid photo-grid--mini">
              {data.photos.map((photo, i) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  index={i}
                  sectionId={section.id}
                  movePhoto={movePhoto}
                />
              ))}
            </div>
          )}
          {section.type === 'mini-stats' && data?.stats && (
            <MiniStats stats={data.stats} />
          )}
          {section.type === 'mini-tasks' && data?.tasks && (
            <div className="mini-tasks">
              {data.tasks.map((task, i) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  index={i}
                  sectionId={section.id}
                  moveTask={moveTask}
                />
              ))}
            </div>
          )}
          {section.type === 'mini-layers' && data?.layers && (
            <div className="mini-layers">
              {data.layers.map((layer, i) => (
                <SortableLayer
                  key={layer.id}
                  layer={layer}
                  index={i}
                  sectionId={section.id}
                  moveLayer={moveLayer}
                />
              ))}
            </div>
          )}
          {section.type === 'mini-nav' && data?.navItems && (
            <div className="mini-nav">
              {data.navItems.map((navItem, i) => (
                <SortableNavItem
                  key={navItem.id}
                  navItem={navItem}
                  index={i}
                  sectionId={section.id}
                  moveNavItem={moveNavItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DROPPABLE PANEL
// ============================================================================

interface DroppablePanelProps {
  id: string;
  label: string;
  sections: Section[];
  sectionData: SectionData;
  moveSection: (dragIndex: number, hoverIndex: number, sourcePanelId: string, targetPanelId: string) => void;
  moveSectionToPanel: (sectionId: string, sourcePanelId: string, targetPanelId: string, targetIndex: number) => void;
  onUpdateTracks: (sectionId: string, tracks: NestedTrack[]) => void;
  onUpdatePhotos: (sectionId: string, photos: PhotoItem[]) => void;
  onUpdateTasks: (sectionId: string, tasks: NestedTask[]) => void;
  onUpdateLayers: (sectionId: string, layers: NestedLayer[]) => void;
  onUpdateNavItems: (sectionId: string, navItems: NestedNavItem[]) => void;
}

const DroppablePanel: React.FC<DroppablePanelProps> = ({
  id,
  label,
  sections,
  sectionData,
  moveSection,
  moveSectionToPanel,
  onUpdateTracks,
  onUpdatePhotos,
  onUpdateTasks,
  onUpdateLayers,
  onUpdateNavItems,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.SECTION_CARD,
    drop: (item: { id: string; panelId: string; index: number }, monitor) => {
      // Only handle drop if not dropped on a card (which handles its own drop)
      if (monitor.didDrop()) return;

      // Move to end of this panel
      if (item.panelId !== id) {
        moveSectionToPanel(item.id, item.panelId, id, sections.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  drop(panelRef);

  return (
    <div
      ref={panelRef}
      className={`nested-panel ${isOver && canDrop ? 'nested-panel--over' : ''}`}
    >
      <div className="nested-panel-header">{label}</div>
      <div className="nested-panel-content">
        {sections.map((section, index) => (
          <DraggableSectionCard
            key={section.id}
            section={section}
            index={index}
            panelId={id}
            sectionData={sectionData}
            moveSection={moveSection}
            moveSectionToPanel={moveSectionToPanel}
            onUpdateTracks={onUpdateTracks}
            onUpdatePhotos={onUpdatePhotos}
            onUpdateTasks={onUpdateTasks}
            onUpdateLayers={onUpdateLayers}
            onUpdateNavItems={onUpdateNavItems}
          />
        ))}
        {sections.length === 0 && (
          <div className="nested-panel-empty">Drop sections here</div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN NESTED CONTAINERS COMPONENT
// ============================================================================

export const NestedContainersDemo: React.FC = () => {
  const [containers, setContainers] = useState<NestedContainers>(initialNestedContainers);
  const [sectionData, setSectionData] = useState<SectionData>(initialSectionData);

  // Move section within or between panels
  const moveSection = useCallback((
    dragIndex: number,
    hoverIndex: number,
    sourcePanelId: string,
    targetPanelId: string
  ) => {
    setContainers(prev => {
      const newContainers = { ...prev };

      if (sourcePanelId === targetPanelId) {
        // Same panel - reorder
        const panelSections = [...prev[sourcePanelId]];
        const [removed] = panelSections.splice(dragIndex, 1);
        panelSections.splice(hoverIndex, 0, removed);
        newContainers[sourcePanelId] = panelSections;
      } else {
        // Different panels - move
        const sourceSections = [...prev[sourcePanelId]];
        const targetSections = [...prev[targetPanelId]];
        const [removed] = sourceSections.splice(dragIndex, 1);
        targetSections.splice(hoverIndex, 0, removed);
        newContainers[sourcePanelId] = sourceSections;
        newContainers[targetPanelId] = targetSections;
      }

      return newContainers;
    });
  }, []);

  // Move section to a different panel at a specific index
  const moveSectionToPanel = useCallback((
    sectionId: string,
    sourcePanelId: string,
    targetPanelId: string,
    targetIndex: number
  ) => {
    setContainers(prev => {
      const newContainers = { ...prev };
      const sourceSections = [...prev[sourcePanelId]];
      const targetSections = [...prev[targetPanelId]];

      const sectionIndex = sourceSections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return prev;

      const [section] = sourceSections.splice(sectionIndex, 1);
      targetSections.splice(targetIndex, 0, section);

      newContainers[sourcePanelId] = sourceSections;
      newContainers[targetPanelId] = targetSections;

      return newContainers;
    });
  }, []);

  // Update handlers for inner items
  const handleUpdateTracks = useCallback((sectionId: string, tracks: NestedTrack[]) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], tracks },
    }));
  }, []);

  const handleUpdatePhotos = useCallback((sectionId: string, photos: PhotoItem[]) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], photos },
    }));
  }, []);

  const handleUpdateTasks = useCallback((sectionId: string, tasks: NestedTask[]) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], tasks },
    }));
  }, []);

  const handleUpdateLayers = useCallback((sectionId: string, layers: NestedLayer[]) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], layers },
    }));
  }, []);

  const handleUpdateNavItems = useCallback((sectionId: string, navItems: NestedNavItem[]) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], navItems },
    }));
  }, []);

  return (
    <div className="nested-dashboard">
      <DroppablePanel
        id="panel-left"
        label="Panel A"
        sections={containers['panel-left']}
        sectionData={sectionData}
        moveSection={moveSection}
        moveSectionToPanel={moveSectionToPanel}
        onUpdateTracks={handleUpdateTracks}
        onUpdatePhotos={handleUpdatePhotos}
        onUpdateTasks={handleUpdateTasks}
        onUpdateLayers={handleUpdateLayers}
        onUpdateNavItems={handleUpdateNavItems}
      />
      <DroppablePanel
        id="panel-center"
        label="Panel B"
        sections={containers['panel-center']}
        sectionData={sectionData}
        moveSection={moveSection}
        moveSectionToPanel={moveSectionToPanel}
        onUpdateTracks={handleUpdateTracks}
        onUpdatePhotos={handleUpdatePhotos}
        onUpdateTasks={handleUpdateTasks}
        onUpdateLayers={handleUpdateLayers}
        onUpdateNavItems={handleUpdateNavItems}
      />
      <DroppablePanel
        id="panel-right"
        label="Panel C"
        sections={containers['panel-right']}
        sectionData={sectionData}
        moveSection={moveSection}
        moveSectionToPanel={moveSectionToPanel}
        onUpdateTracks={handleUpdateTracks}
        onUpdatePhotos={handleUpdatePhotos}
        onUpdateTasks={handleUpdateTasks}
        onUpdateLayers={handleUpdateLayers}
        onUpdateNavItems={handleUpdateNavItems}
      />
    </div>
  );
};

export default NestedContainersDemo;
