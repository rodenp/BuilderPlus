import React, { useState } from 'react';
import {
  MousePointerClick,
  Settings,
  X,
} from 'lucide-react';
import { ButtonPanel } from './components/ButtonPanel';
import { HeadingPanel } from './components/HeadingPanel';
import { TextPanel } from './components/TextPanel';
import { LinkPanel } from './components/LinkPanel';
import { ImagePanel } from './components/ImagePanel';
import { VideoPanel } from './components/VideoPanel';
import { InputPanel } from './components/InputPanel';
import { SpacerPanel } from './components/SpacerPanel';
import { DividerPanel } from './components/DividerPanel';
import { ColumnsPanel } from './components/ColumnsPanel';
import { ContainerPanel } from './components/ContainerPanel';
import { ListPanel } from './components/ListPanel';
import { MenuPanel } from './components/MenuPanel';
import { BreadcrumbPanel } from './components/BreadcrumbPanel';
import { SelectPanel } from './components/SelectPanel';

import { ColorSection } from './components/common/ColorSection';
import { SpacingSection } from './components/common/SpacingSection';
import { BorderSection } from './components/common/BorderSection';
import { LayoutSection } from './components/common/LayoutSection';
import { HtmlAttributesSection } from './components/common/HtmlAttributesSection';

// Input Components
import { TextInput } from './components/inputs/TextInput';
import { NumberInput } from './components/inputs/NumberInput';
import { BooleanInput } from './components/inputs/BooleanInput';
import { DateInput } from './components/inputs/DateInput';
import { TimeInput } from './components/inputs/TimeInput';
import { DurationInput } from './components/inputs/DurationInput';
import { SelectInput } from './components/inputs/SelectInput';
import { IconInput } from './components/inputs/IconInput';
import { ColorInput } from './components/inputs/ColorInput';

import type { Theme } from './theme';
import type { CanvasComponent } from '../../../types/component-types';
import { getComponentProperties, getDefaultProps } from '../../canvas-components/register';
import { getMergedProps } from '../../../utils/inheritance';
import type { BodySettings } from '../../../types/bodySettings';
import type { MediaItem } from '../../../types/media';
import { Section } from './Section';
import { createLabelStyle } from './styles';
import { globalStyleRegistry } from '../../../config/style-properties';
import { globalThemeRegistry } from '../../../core/theme-registry';
import { resolveProperty } from '../../../utils/property-resolver';

interface PropertyPanelProps {
  theme: Theme;
  component?: CanvasComponent | null;
  onComponentChange?: (component: CanvasComponent) => void;
  onDeselect?: () => void;
  onOpenMediaGallery?: (onSelect: (item: MediaItem) => void, allowedTypes?: ('image' | 'video' | 'audio' | 'file')[]) => void;
  isCanvasDark: boolean;
  components?: CanvasComponent[];
  bodySettings?: BodySettings; // Add bodySettings as optional
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  theme,
  component,
  onComponentChange,
  onDeselect,
  onOpenMediaGallery,

  components = [],
  bodySettings, // Destructure
}) => {
  // Get default colors for the canvas

  // 1. Resolve active canvas theme
  const activeCanvasThemeId = bodySettings?.activeCanvasThemeId || 'light';
  const systemTheme = globalThemeRegistry.getTheme(activeCanvasThemeId);
  const customTheme = bodySettings?.customThemes?.find(t => t.id === activeCanvasThemeId);
  const activeThemeObject = systemTheme || customTheme || globalThemeRegistry.getTheme('light');

  // 2. Get defaults from registry
  const registryDefaults = globalStyleRegistry.getGroups().reduce((acc, group) => {
    group.properties.forEach(prop => {
      if (prop.systemFallback !== undefined) {
        acc[prop.key as string] = prop.systemFallback;
      }
    });
    return acc;
  }, {} as Record<string, any>);

  // 3. Merge: Active Theme Styles > Registry defaults
  const themeDefaults = { ...registryDefaults, ...activeThemeObject?.styles };

  // Compute component-aware theme defaults (e.g. Buttons use Primary color as BG fallback)
  const isAccent = component?.type === 'button';
  const resolvedThemeDefaults = {
    ...themeDefaults,
    backgroundColor: isAccent ? themeDefaults.primaryColor : themeDefaults.backgroundColor,
  };

  // Compute "Parent-Only" inherited properties (to show in picker when component is cleared)
  const inheritedProps = component ? getMergedProps(component.id, components, resolvedThemeDefaults, getDefaultProps, true) : resolvedThemeDefaults;

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'content',
    'colors',
    'spacing',
    'actions',
  ]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Get styles
  // const inputStyle = createInputStyle(theme); // No longer needed directly here
  const labelStyle = createLabelStyle(theme);

  // Helper to update component props
  const updateProp = (key: string, value: unknown) => {
    if (component && onComponentChange) {
      onComponentChange({
        ...component,
        props: { ...component.props, [key]: value },
      });
    }
  };

  // Component Definition & Defaults
  const componentDef = component ? getComponentProperties(component.type) : undefined;
  const defaultProps = component ? getDefaultProps(component.type) : undefined;

  // Helper: Resolve a property value using the full hierarchy
  const resolveProp = (key: string) => {
    if (!component) return undefined;

    // 1. Find field definition to get themeKey
    const field = componentDef?.fields.find(f => f.key === key);
    const themeKey = field?.themeKey;

    // 2. Find system fallback from registry (if themeKey exists)
    let systemFallback = undefined;
    if (themeKey) {
      for (const group of globalStyleRegistry.getGroups()) {
        const prop = group.properties.find(p => p.key === themeKey);
        if (prop) {
          systemFallback = prop.systemFallback;
          break;
        }
      }
    }

    // 3. Resolve
    return resolveProperty(
      component.props,
      key,
      defaultProps ? defaultProps[key] : undefined,
      (themeKey && activeThemeObject) ? activeThemeObject.styles[themeKey] : undefined,
      inheritedProps?.[key] ?? systemFallback
    );
  };

  // Common props for panels - HOISTED
  const panelProps = {
    component: component!, // We only use this when component is defined
    theme,
    updateProp,
    resolveProp,
    onOpenMediaGallery,
    expandedSections,
    toggleSection,
    inheritedProps,
    themeDefaults: resolvedThemeDefaults,
  };

  // Render component-specific properties
  const renderComponentProperties = () => {
    if (!component) return null;

    switch (component.type) {
      case 'button':
        return <ButtonPanel {...panelProps} />;

      case 'heading':
        return <HeadingPanel {...panelProps} />;

      case 'paragraph':
      case 'text':
        return <TextPanel {...panelProps} />;

      case 'link':
        return <LinkPanel {...panelProps} />;

      case 'image':
        return <ImagePanel {...panelProps} />;

      case 'video':
        return <VideoPanel {...panelProps} />;

      case 'input':
        return <InputPanel {...panelProps} />;

      case 'spacer':
        return <SpacerPanel {...panelProps} />;

      case 'divider':
        return <DividerPanel {...panelProps} />;

      case 'columns':
        return <ColumnsPanel {...panelProps} />;

      case 'container':
        return <ContainerPanel {...panelProps} />;

      case 'list':
        return;

      case 'menu':
        return <MenuPanel {...panelProps} />;

      case 'breadcrumb':
        return <BreadcrumbPanel {...panelProps} />;

      case 'select':
        return <SelectPanel {...panelProps} />;

      default: {
        const registeredProps = getComponentProperties(component.type);

        if (!registeredProps) {
          return (
            <Section
              id="content"
              icon={<Settings style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Properties"
              isExpanded={expandedSections.includes('content')}
              onToggle={toggleSection}
              theme={theme}
            >
              <p style={{ fontSize: '12px', color: theme.textMuted }}>
                No specific properties for this component type.
              </p>
            </Section>
          );
        }

        const groupedProps = registeredProps.fields.reduce((groups, prop) => {
          const group = prop.group || 'content';
          if (!groups[group]) groups[group] = [];
          groups[group].push(prop);
          return groups;
        }, {} as Record<string, typeof registeredProps.fields>);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            {Object.entries(groupedProps).map(([group, props]) => {
              // Skip groups that are typically handled by common sections to avoid duplicates
              if (['style', 'layout', 'spacing', 'border', 'attributes', 'colors'].includes(group)) return null;

              const title = group.charAt(0).toUpperCase() + group.slice(1);

              return (
                <Section
                  key={group}
                  id={group}
                  icon={<Settings style={{ width: 16, height: 16, color: theme.textMuted }} />}
                  title={title}
                  isExpanded={expandedSections.includes(group)}
                  onToggle={() => toggleSection(group)}
                  theme={theme}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {props.map(prop => (
                      <div key={prop.key}>
                        {/* Always show label, unless the input type handles it (like ColorInput or BooleanInput might) 
                            But adhering to previous design, we show label for everything, and ColorPicker showed label again inside.
                            For now, we render label for all non-custom-label types. 
                            ColorInput takes `label` prop so we pass it there.
                        */}
                        <label style={labelStyle}>{prop.label}</label>

                        {prop.type === 'text' && (
                          <TextInput
                            value={resolveProp(prop.key)}
                            onChange={(val) => updateProp(prop.key, val)}
                            placeholder={prop.placeholder || `${prop.label}...`}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'number' && (
                          <NumberInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'date' && (
                          <DateInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'time' && (
                          <TimeInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'duration' && (
                          <DurationInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'icon' && (
                          <IconInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            options={prop.options}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'boolean' && (
                          <BooleanInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            theme={theme}
                          />
                        )}

                        {prop.type === 'color' && (
                          <ColorInput
                            value={component.props[prop.key]}
                            onChange={(val) => updateProp(prop.key, val)}
                            label={prop.label}
                            theme={theme}
                            defaultValue={prop.defaultValue as string}
                            themeDefault={(resolvedThemeDefaults as any)[prop.key]}
                            inheritedValue={(inheritedProps as any)[prop.key]}
                          />
                        )}

                        {prop.type === 'select' && (
                          <SelectInput
                            value={resolveProp(prop.key)}
                            onChange={(val) => updateProp(prop.key, val)}
                            options={prop.options}
                            theme={theme}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              );
            })}
          </div>
        );
      }
    }
  };

  // If editing a selected component
  if (component) {
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
            position: 'relative',
            backgroundColor: theme.bg,
            color: theme.text,
            borderLeft: `1px solid ${theme.border}`,
          }}
        >
          {/* Header with back button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <button
              onClick={onDeselect}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: theme.bgSecondary,
                border: 'none',
                cursor: 'pointer',
                color: theme.textMuted,
              }}
              title="Back to components"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
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
              <MousePointerClick style={{ width: 16, height: 16, color: theme.primaryText }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>
                {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
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
                Component properties
              </p>
            </div>
          </div>

          {/* Component Properties - Scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            {/* Component-specific content section */}
            {renderComponentProperties()}

            {/* COLORS Section */}
            <ColorSection {...panelProps} />

            {/* SPACING Section - Box Model */}
            <SpacingSection {...panelProps} />

            {/* BORDER Section */}
            <BorderSection {...panelProps} />

            {/* LAYOUT Section */}
            <LayoutSection {...panelProps} />

            {/* HTML ATTRIBUTES Section */}
            <HtmlAttributesSection {...panelProps} />
          </div>
        </div>
      </div>
    );
  }

  // Default panel (when no component is selected)
  return (
    <div
      style={{
        width: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: theme.bg,
        color: theme.text,
        borderLeft: `1px solid ${theme.border}`,
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <p style={{ color: theme.textMuted, fontSize: '14px' }}>
        Select a component on the canvas to edit its properties.
      </p>
    </div>
  );
};
