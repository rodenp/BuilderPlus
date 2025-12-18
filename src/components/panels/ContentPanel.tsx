import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { DragTypes } from '../../types/dnd-types';
import {
  MousePointerClick,
  Minus,
  MoveVertical,
  Heading,
  AlignLeft,
  Type,
  List,
  Quote,
  Image,
  Video,
  Smile,
  Square,
  Columns,
  CreditCard,
  LayoutTemplate,
  TextCursor,
  FileText,
  CheckSquare,
  Circle,
  ChevronDown,
  ClipboardList,
  Link,
  Menu,
  ChevronRight,
  LayoutGrid,
  GripVertical,
  Music,
  FolderKanban,
  File,
  Library,
  Sun,
  Waves,
  Sunset,
  FileEdit
} from 'lucide-react';
import type { Theme } from './property-panel/theme';
import type { ComponentDefinition, ComponentCategory } from '../../types/component-types';
import { categories } from '../../data/component-definitions';
import { getComponentDefinitions } from '../../components/canvas-components/register';
import { Section } from './property-panel/Section';

interface ContentPanelProps {
  theme: Theme;
  removeComponent: (id: string) => void;
}

// Individual draggable component item
interface DraggableComponentProps {
  component: ComponentDefinition;
  theme: Theme;
  removeComponent: (id: string) => void;
}

// Icon mapping - kept the same
const iconMap: Record<string, React.FC<{ style?: React.CSSProperties }>> = {
  MousePointerClick,
  Minus,
  MoveVertical,
  Heading,
  AlignLeft,
  Type,
  List,
  Quote,
  Image,
  Video,
  Smile,
  Square,
  Columns,
  CreditCard,
  LayoutTemplate,
  TextCursor,
  FileText,
  CheckSquare,
  Circle,
  ChevronDown,
  ClipboardList,
  Link,
  Menu,
  ChevronRight,
  Music,
  FolderKanban,
  File,
  Library,
  Sun,
  Waves,
  Sunset,
  FileEdit
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  theme,
  removeComponent
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.NEW_COMPONENT,
    item: {
      type: 'NEW_COMPONENT',
      componentDef: component
    },
    end: (item: any, monitor) => {
      // Cleanup if dropped outside or cancelled
      // AND if the item was converted to a real component (has an ID assigned during hover)
      if (!monitor.didDrop() && item.id && item.type === DragTypes.ITEM) {
        removeComponent(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const IconComponent = iconMap[component.icon];

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '12px 8px',
        backgroundColor: theme.bgSecondary,
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        transition: 'all 0.15s',
        position: 'relative',
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab',
        borderColor: isDragging ? theme.primary : theme.border,
      }}
      title={component.description}
    >
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          opacity: 0.3,
        }}
      >
        <GripVertical style={{ width: 10, height: 10, color: theme.textMuted }} />
      </div>
      {IconComponent && (
        <IconComponent
          style={{
            width: 20,
            height: 20,
            color: theme.text,
          }}
        />
      )}
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: theme.textSecondary,
          textAlign: 'center',
        }}
      >
        {component.label}
      </span>
    </div>
  );
};

export const ContentPanel: React.FC<ContentPanelProps> = ({
  theme,
  removeComponent
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'basic',
    'typography',
    'layout',
  ]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (categoryId: ComponentCategory) => {
    switch (categoryId) {
      case 'basic':
        return <MousePointerClick style={{ width: 16, height: 16, color: theme.textMuted }} />;
      case 'typography':
        return <Type style={{ width: 16, height: 16, color: theme.textMuted }} />;
      case 'media':
        return <Image style={{ width: 16, height: 16, color: theme.textMuted }} />;
      case 'layout':
        return <LayoutTemplate style={{ width: 16, height: 16, color: theme.textMuted }} />;
      case 'forms':
        return <TextCursor style={{ width: 16, height: 16, color: theme.textMuted }} />;
      case 'navigation':
        return <Link style={{ width: 16, height: 16, color: theme.textMuted }} />;
      default:
        return <LayoutGrid style={{ width: 16, height: 16, color: theme.textMuted }} />;
    }
  };

  const renderComponentItem = (component: ComponentDefinition) => {
    return (
      <DraggableComponent
        key={component.type}
        component={component}
        theme={theme}
        removeComponent={removeComponent}
      />
    );
  };

  return (
    <div
      style={{
        width: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: theme.bg,
          color: theme.text,
          borderLeft: `1px solid ${theme.border}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px',
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: theme.primaryBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayoutGrid style={{ width: 16, height: 16, color: theme.primaryText }} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>
              Components
            </h3>
            <p
              style={{
                fontSize: '10px',
                color: theme.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              Drag to canvas
            </p>
          </div>
        </div>

        {/* Categories - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {categories.map((category) => {
            const allDefinitions = getComponentDefinitions();
            const components = allDefinitions.filter(c => c.category === category.id);

            return (
              <Section
                key={category.id}
                id={category.id}
                icon={getCategoryIcon(category.id)}
                title={category.label}
                isExpanded={expandedSections.includes(category.id)}
                onToggle={toggleSection}
                theme={theme}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  {components.map(renderComponentItem)}
                </div>
              </Section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
