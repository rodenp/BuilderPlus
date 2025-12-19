import React, { useState } from 'react';
import {
  MousePointerClick,
  Image,
  Video,
  FolderOpen,
  X,
  Palette,
  Type,
  Box,
  Layout,
  Link,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Link2Off,
} from 'lucide-react';
import { RichTextPropertyInput } from './RichTextPropertyInput';
import type { Theme } from './theme';
import type { CanvasComponent } from '../../../types/component-types';
import { getComponentProperties, getDefaultProps } from '../../canvas-components/register';
import { getMergedProps } from '../../../utils/inheritance';
import type { BodySettings } from '../../../types/bodySettings';
import type { MediaItem } from '../../../types/media';
import { Section } from './Section';
import { BoxModelControl } from './BoxModelControl';
import { ColorPicker } from './ColorPicker';
import { PanelHeader } from './PanelHeader';
import { PanelFooter } from './PanelFooter';
import { createInputStyle, createLabelStyle, createButtonGroupStyle, createSmallInputStyle } from './styles';
import { globalStyleRegistry } from '../../../config/style-properties';
import { globalThemeRegistry } from '../../../core/theme-registry';
import { resolveProperty, parseSpacing } from '../../../utils/property-resolver';

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
  isCanvasDark,
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

  // Form state
  // Form state (Demo only)
  const [demoContent, setDemoContent] = useState('Click me!');
  const [demoBgColor, setDemoBgColor] = useState('#0ea5e9');
  const [demoTextColor, setDemoTextColor] = useState('#ffffff');
  const [demoPrimaryColor, setDemoPrimaryColor] = useState('#2563eb');

  // Box model state
  const [margin, setMargin] = useState({ top: '0', right: '0', bottom: '0', left: '0' });
  const [padding, setPadding] = useState({ top: '12', right: '24', bottom: '12', left: '24' });
  const [marginLinked, setMarginLinked] = useState(false);
  const [paddingLinked, setPaddingLinked] = useState(false);

  // Border state
  const [borderWidth, setBorderWidth] = useState('0');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, _setBorderColor] = useState('#e2e8f0');
  const [borderRadius, setBorderRadius] = useState({ tl: '8', tr: '8', bl: '8', br: '8' });
  const [radiusLinked, setRadiusLinked] = useState(true);

  // Color picker state
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);

  // HTML Attributes
  const [htmlId, setHtmlId] = useState('');
  const [htmlClass, setHtmlClass] = useState('');
  const [href, setHref] = useState('');
  const [target, setTarget] = useState('_self');

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleMarginChange = (side: keyof typeof margin, value: string) => {
    if (marginLinked) {
      setMargin({ top: value, right: value, bottom: value, left: value });
    } else {
      setMargin({ ...margin, [side]: value });
    }
  };

  const handlePaddingChange = (side: keyof typeof padding, value: string) => {
    if (paddingLinked) {
      setPadding({ top: value, right: value, bottom: value, left: value });
    } else {
      setPadding({ ...padding, [side]: value });
    }
  };

  const handleRadiusChange = (corner: keyof typeof borderRadius, value: string) => {
    if (radiusLinked) {
      setBorderRadius({ tl: value, tr: value, bl: value, br: value });
    } else {
      setBorderRadius({ ...borderRadius, [corner]: value });
    }
  };

  // Get styles
  const inputStyle = createInputStyle(theme);
  const labelStyle = createLabelStyle(theme);
  const smallInputStyle = createSmallInputStyle(theme);
  // const durationInputStyle = createDurationInputStyle(theme);

  // For handling multiple color pickers in dynamic props
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

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
    // Fix: activeThemeObject might be undefined? Ensure we handle it.
    // Line 64: `const activeThemeObject = ...`. It is derived from registry, theoretically always exists if 'light' exists.
    // But typescript warns.
    return resolveProperty(
      component.props,
      key,
      defaultProps?.[key],
      (themeKey && activeThemeObject) ? activeThemeObject.styles[themeKey] : undefined,
      systemFallback
    );
  };

  // Helper: Resolve spacing to object { top, right, bottom, left }
  const resolveSpacing = (key: string) => parseSpacing(resolveProp(key));

  // Render component-specific properties
  const renderComponentProperties = () => {
    if (!component) return null;

    // Determine default canvas colors based on isCanvasDark
    // Using themeDefaults computed above

    switch (component.type) {
      case 'button':
        return (
          <>
            <Section
              id="content"
              icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Content"
              isExpanded={expandedSections.includes('content')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div>
                <label style={labelStyle}>Button Text</label>
                <input
                  type="text"
                  value={(resolveProp('text') as string) || ''}
                  onChange={(e) => updateProp('text', e.target.value)}
                  placeholder="Enter button text..."
                  style={inputStyle}
                />
              </div>
            </Section>

            <Section
              id="actions"
              icon={<MousePointerClick style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Actions"
              isExpanded={expandedSections.includes('actions')}
              onToggle={toggleSection}
              theme={theme}
            >
              {/* Action Type Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={labelStyle}>Action Type</label>
                <select
                  value={(resolveProp('actionType') as string) || 'link'}
                  onChange={(e) => updateProp('actionType', e.target.value)}
                  style={{
                    ...inputStyle,
                    width: 'auto',
                    minWidth: '140px',
                    height: '32px',
                    padding: '0 8px',
                    backgroundColor: theme.bgSecondary, // Theme background
                    color: theme.text,
                    borderColor: theme.border
                  }}
                >
                  <option value="link">Open Website</option>
                  <option value="submit">Submit Form</option>
                  <option value="scroll">Scroll to Section</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Compact Input Group Helper */}
              {(component.props.actionType === 'link' || !component.props.actionType) && (
                <>
                  {/* URL Row */}
                  <div style={{ display: 'flex', marginBottom: '8px', border: `1px solid ${theme.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: '80px',
                      backgroundColor: theme.bgSecondary, // Theme background 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      color: theme.textMuted,
                      fontWeight: 500
                    }}>
                      URL
                    </div>
                    <input
                      type="text"
                      value={(resolveProp('url') as string) || ''}
                      onChange={(e) => updateProp('url', e.target.value)}
                      placeholder="https://"
                      style={{
                        flex: 1,
                        border: 'none',
                        height: '32px',
                        padding: '0 8px',
                        outline: 'none',
                        fontSize: '13px',
                        backgroundColor: 'transparent',
                        color: theme.text
                      }}
                    />
                  </div>

                  {/* Target Row */}
                  <div style={{ display: 'flex', border: `1px solid ${theme.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: '80px',
                      backgroundColor: theme.bgSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: `1px solid ${theme.border}`,
                      fontSize: '12px',
                      color: theme.textMuted,
                      fontWeight: 500
                    }}>
                      Target
                    </div>
                    <select
                      value={(resolveProp('target') as string) || '_self'}
                      onChange={(e) => updateProp('target', e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        height: '32px',
                        padding: '0 8px',
                        outline: 'none',
                        fontSize: '13px',
                        backgroundColor: 'transparent',
                        color: theme.text
                      }}
                    >
                      <option value="_self">Same Tab</option>
                      <option value="_blank">New Tab</option>
                    </select>
                  </div>
                </>
              )}
            </Section>
          </>
        );

      case 'heading':
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Content"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Heading Text</label>
              <input
                type="text"
                value={(resolveProp('text') as string) || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Enter heading..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Heading Level</label>
              <select
                value={(resolveProp('level') as string) || 'h2'}
                onChange={(e) => updateProp('level', e.target.value)}
                style={inputStyle}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>
          </Section>
        );

      case 'paragraph':
      case 'text':
        return (
          <>
            <Section
              id="content"
              icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Content"
              isExpanded={expandedSections.includes('content')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div>
                <label style={labelStyle}>Text</label>
                <RichTextPropertyInput
                  value={(component.props.text as string) || ''}
                  onChange={(val) => updateProp('text', val)}
                  placeholder="Enter text..."
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </Section>

            <Section
              id="dimensions"
              icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Dimensions & Scroll"
              isExpanded={expandedSections.includes('content')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div>
                <label style={labelStyle}>Height</label>
                <input
                  type="text"
                  value={(component.props.height as string) || ''}
                  onChange={(e) => updateProp('height', e.target.value)}
                  placeholder="auto"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Max Height</label>
                <input
                  type="text"
                  value={(component.props.maxHeight as string) || ''}
                  onChange={(e) => updateProp('maxHeight', e.target.value)}
                  placeholder="none"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Scroll Behavior</label>
                <select
                  value={(component.props.overflow as string) || 'auto'}
                  onChange={(e) => updateProp('overflow', e.target.value)}
                  style={inputStyle}
                >
                  <option value="auto">Auto (Scroll)</option>
                  <option value="visible">Visible (Grow)</option>
                  <option value="hidden">Hidden (Clip)</option>
                  <option value="scroll">Scroll (Always)</option>
                </select>
              </div>
            </Section>
          </>
        );

      case 'link':
        return (
          <Section
            id="content"
            icon={<Link style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Link"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Link Text</label>
              <input
                type="text"
                value={(component.props.text as string) || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Link text..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>URL</label>
              <input
                type="text"
                value={(component.props.href as string) || ''}
                onChange={(e) => updateProp('href', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Target</label>
              <select
                value={(component.props.target as string) || '_self'}
                onChange={(e) => updateProp('target', e.target.value)}
                style={inputStyle}
              >
                <option value="_self">Same Tab</option>
                <option value="_blank">New Tab</option>
              </select>
            </div>
          </Section>
        );

      case 'image':
        return (
          <Section
            id="content"
            icon={<Image style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Image"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            {/* Image preview */}
            {(component.props.src as string) && (
              <div
                style={{
                  marginBottom: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <img
                  src={component.props.src as string}
                  alt={(component.props.alt as string) || ''}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '120px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            )}
            <div>
              <label style={labelStyle}>Image URL</label>
              <input
                type="text"
                value={(component.props.src as string) || ''}
                onChange={(e) => updateProp('src', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            {onOpenMediaGallery && (
              <button
                onClick={() => {
                  onOpenMediaGallery((item) => {
                    updateProp('src', item.url);
                    if (item.type === 'image') {
                      const mediaWithAlt = item as MediaItem & { alt?: string };
                      if (mediaWithAlt.alt) {
                        updateProp('alt', mediaWithAlt.alt);
                      }
                    }
                  }, ['image']);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px',
                  marginTop: '8px',
                  backgroundColor: theme.primaryBg,
                  color: theme.primaryText,
                  border: `1px solid ${theme.primary}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <FolderOpen style={{ width: 14, height: 14 }} />
                Select from Gallery
              </button>
            )}
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Alt Text</label>
              <input
                type="text"
                value={(component.props.alt as string) || ''}
                onChange={(e) => updateProp('alt', e.target.value)}
                placeholder="Image description..."
                style={inputStyle}
              />
            </div>
          </Section>
        );

      case 'video':
        return (
          <Section
            id="content"
            icon={<Video style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Video"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            {/* Video preview */}
            {(component.props.src as string) && (
              <div
                style={{
                  marginBottom: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <video
                  key={component.props.src as string}
                  controls
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '120px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                >
                  <source src={component.props.src as string} type="video/mp4" />
                </video>
              </div>
            )}
            <div>
              <label style={labelStyle}>Video URL</label>
              <input
                type="text"
                value={(component.props.src as string) || ''}
                onChange={(e) => updateProp('src', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            {onOpenMediaGallery && (
              <button
                onClick={() => {
                  onOpenMediaGallery((item) => {
                    updateProp('src', item.url);
                  }, ['video']);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px',
                  marginTop: '8px',
                  backgroundColor: theme.primaryBg,
                  color: theme.primaryText,
                  border: `1px solid ${theme.primary}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <FolderOpen style={{ width: 14, height: 14 }} />
                Select from Gallery
              </button>
            )}
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Poster Image</label>
              <input
                type="text"
                value={(component.props.poster as string) || ''}
                onChange={(e) => updateProp('poster', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
              {onOpenMediaGallery && (
                <button
                  onClick={() => {
                    onOpenMediaGallery((item) => {
                      updateProp('poster', item.url);
                    }, ['image']);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px',
                    marginTop: '8px',
                    backgroundColor: theme.bgSecondary,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  <FolderOpen style={{ width: 12, height: 12 }} />
                  Select Poster from Gallery
                </button>
              )}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.text, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(component.props.autoplay as boolean) || false}
                  onChange={(e) => updateProp('autoplay', e.target.checked)}
                  style={{ width: '14px', height: '14px' }}
                />
                Autoplay
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.text, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(component.props.loop as boolean) || false}
                  onChange={(e) => updateProp('loop', e.target.checked)}
                  style={{ width: '14px', height: '14px' }}
                />
                Loop
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.text, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(component.props.muted as boolean) || false}
                  onChange={(e) => updateProp('muted', e.target.checked)}
                  style={{ width: '14px', height: '14px' }}
                />
                Muted
              </label>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.text, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(component.props.controls as boolean) !== false}
                  onChange={(e) => updateProp('controls', e.target.checked)}
                  style={{ width: '14px', height: '14px' }}
                />
                Show Controls
              </label>
            </div>
          </Section>
        );

      case 'input':
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Input"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Label</label>
              <input
                type="text"
                value={(component.props.label as string) || ''}
                onChange={(e) => updateProp('label', e.target.value)}
                placeholder="Label..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Placeholder</label>
              <input
                type="text"
                value={(component.props.placeholder as string) || ''}
                onChange={(e) => updateProp('placeholder', e.target.value)}
                placeholder="Placeholder..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Input Type</label>
              <select
                value={(component.props.type as string) || 'text'}
                onChange={(e) => updateProp('type', e.target.value)}
                style={inputStyle}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
              </select>
            </div>
          </Section>
        );

      case 'spacer':
        return (
          <Section
            id="content"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Spacer"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Height</label>
              <input
                type="text"
                value={(component.props.height as string) || '32px'}
                onChange={(e) => updateProp('height', e.target.value)}
                placeholder="32px"
                style={inputStyle}
              />
            </div>
          </Section>
        );

      case 'divider':
        return (
          <Section
            id="content"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Divider"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Thickness</label>
              <input
                type="text"
                value={(component.props.thickness as string) || '1px'}
                onChange={(e) => updateProp('thickness', e.target.value)}
                placeholder="1px"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <input
                type="text"
                value={(component.props.color as string) || '#e5e7eb'}
                onChange={(e) => updateProp('color', e.target.value)}
                placeholder="#e5e7eb"
                style={inputStyle}
              />
            </div>
          </Section>
        );

      case 'columns':
        return (
          <Section
            id="content"
            icon={<Layout style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Columns"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Number of Columns</label>
              <select
                value={(component.props.columns as number) || 2}
                onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                style={inputStyle}
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gap</label>
              <input
                type="text"
                value={(component.props.gap as string) || '16px'}
                onChange={(e) => updateProp('gap', e.target.value)}
                placeholder="16px"
                style={inputStyle}
              />
            </div>
          </Section>
        );

      case 'container':
        return (
          <Section
            id="content"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Container"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <p style={{ fontSize: '12px', color: theme.textMuted }}>
              Container for grouping components. Use Layout section to configure flex properties.
            </p>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Scroll Behavior</label>
              <select
                value={(component.props.overflow as string) || 'visible'}
                onChange={(e) => updateProp('overflow', e.target.value)}
                style={inputStyle}
              >
                <option value="auto">Auto (Scroll)</option>
                <option value="visible">Visible (Grow)</option>
                <option value="hidden">Hidden (Clip)</option>
                <option value="scroll">Scroll (Always)</option>
              </select>
            </div>
          </Section>
        );

      case 'list':
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="List Settings"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>List Type</label>
              <select
                value={(component.props.listType as string) || 'unordered'}
                onChange={(e) => updateProp('listType', e.target.value)}
                style={inputStyle}
              >
                <option value="unordered">Unordered (bullets)</option>
                <option value="ordered">Ordered (numbers)</option>
              </select>
            </div>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '12px' }}>
              Click on individual list items in the canvas to edit their text properties.
              Use the Layout section to change flex display settings.
            </p>
          </Section>
        );

      case 'menu':
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Menu Settings"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <p style={{ fontSize: '12px', color: theme.textMuted }}>
              Click on individual menu links in the canvas to edit their text and URL.
              Use the Layout section to change flex direction and spacing.
            </p>
          </Section>
        );

      case 'breadcrumb': {
        const breadcrumbItems = (component.props.items as string[]) || ['Home', 'Category', 'Page'];
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Breadcrumb"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Separator</label>
              <input
                type="text"
                value={(component.props.separator as string) || '/'}
                onChange={(e) => updateProp('separator', e.target.value)}
                placeholder="/"
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Items</label>
              {breadcrumbItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...breadcrumbItems];
                      newItems[index] = e.target.value;
                      updateProp('items', newItems);
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={() => {
                      const newItems = breadcrumbItems.filter((_, i) => i !== index);
                      updateProp('items', newItems);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: theme.textMuted,
                    }}
                    title="Remove item"
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  updateProp('items', [...breadcrumbItems, `Page ${breadcrumbItems.length + 1}`]);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: theme.primaryBg,
                  color: theme.primaryText,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                + Add Crumb
              </button>
            </div>
          </Section>
        );
      }

      case 'select': {
        const selectOptions = (component.props.options as string[]) || ['Option 1', 'Option 2', 'Option 3'];
        return (
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Select"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Label</label>
              <input
                type="text"
                value={(component.props.label as string) || ''}
                onChange={(e) => updateProp('label', e.target.value)}
                placeholder="Label..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Placeholder</label>
              <input
                type="text"
                value={(component.props.placeholder as string) || ''}
                onChange={(e) => updateProp('placeholder', e.target.value)}
                placeholder="Select an option..."
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Options</label>
              {selectOptions.map((opt, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...selectOptions];
                      newOptions[index] = e.target.value;
                      updateProp('options', newOptions);
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={() => {
                      const newOptions = selectOptions.filter((_, i) => i !== index);
                      updateProp('options', newOptions);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: theme.textMuted,
                    }}
                    title="Remove option"
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  updateProp('options', [...selectOptions, `Option ${selectOptions.length + 1}`]);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: theme.primaryBg,
                  color: theme.primaryText,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                + Add Option
              </button>
            </div>
          </Section>
        );
      }

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
              // However, for custom components we might want to show them if they aren't standard
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
                        <label style={labelStyle}>{prop.label}</label>

                        {prop.type === 'text' && (
                          <input
                            type="text"
                            value={(resolveProp(prop.key) as string) || ''}
                            onChange={(e) => updateProp(prop.key, e.target.value)}
                            placeholder={prop.placeholder || `${prop.label}...`}
                            style={inputStyle}
                          />
                        )}

                        {prop.type === 'number' && (
                          <input
                            type="number"
                            value={(component.props[prop.key] as number) || 0}
                            onChange={(e) => updateProp(prop.key, parseFloat(e.target.value))}
                            style={inputStyle}
                          />
                        )}

                        {prop.type === 'date' && (
                          <input
                            type="date"
                            value={(component.props[prop.key] as string) || ''}
                            onChange={(e) => updateProp(prop.key, e.target.value)}
                            style={inputStyle}
                          />
                        )}

                        {prop.type === 'time' && (
                          <input
                            type="time"
                            value={(component.props[prop.key] as string) || ''}
                            onChange={(e) => updateProp(prop.key, e.target.value)}
                            style={inputStyle}
                          />
                        )}

                        {prop.type === 'duration' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {/* Helper to parse/update duration string "HH:MM:SS" */}
                            {(() => {
                              const val = (component.props[prop.key] as string) || '00:00:00';
                              const parts = val.split(':');
                              // Pad or truncate to ensure 3 parts
                              while (parts.length < 3) parts.unshift('00');
                              const [h, m, s] = parts;

                              const updatePart = (index: number, newVal: string) => {
                                // clamp or pad
                                let v = parseInt(newVal) || 0;
                                if (v < 0) v = 0;
                                if (index > 0 && v > 59) v = 59; // Minutes/Seconds limit
                                const strV = v.toString().padStart(2, '0');
                                const newParts = [...parts];
                                newParts[index] = strV;
                                updateProp(prop.key, newParts.join(':'));
                              };

                              const durationInputStyle = {
                                ...inputStyle,
                                textAlign: 'center' as const,
                                padding: '4px',
                              };

                              return (
                                <>
                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="number"
                                      value={h}
                                      onChange={e => updatePart(0, e.target.value)}
                                      style={durationInputStyle}
                                      placeholder="HH"
                                    />
                                    <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>HR</div>
                                  </div>
                                  <span style={{ paddingTop: '6px', color: theme.textMuted }}>:</span>
                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="number"
                                      value={m}
                                      onChange={e => updatePart(1, e.target.value)}
                                      style={durationInputStyle}
                                      placeholder="MM"
                                    />
                                    <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>MIN</div>
                                  </div>
                                  <span style={{ paddingTop: '6px', color: theme.textMuted }}>:</span>
                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="number"
                                      value={s}
                                      onChange={e => updatePart(2, e.target.value)}
                                      style={durationInputStyle}
                                      placeholder="SS"
                                    />
                                    <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center' }}>SEC</div>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        )}

                        {prop.type === 'icon' && (
                          <select
                            value={(component.props[prop.key] as string) || prop.options?.[0]?.value}
                            onChange={(e) => updateProp(prop.key, e.target.value)}
                            style={inputStyle}
                          >
                            {prop.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        )}

                        {prop.type === 'boolean' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="checkbox"
                              checked={(component.props[prop.key] as boolean) || false}
                              onChange={(e) => updateProp(prop.key, e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span style={{ fontSize: '12px', color: theme.text }}>Enabled</span>
                          </div>
                        )}

                        {prop.type === 'color' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <ColorPicker
                              label={prop.label}
                              color={component.props[prop.key] as string | null | undefined}
                              onChange={(color) => updateProp(prop.key, color)}
                              isOpen={activeColorPicker === prop.key}
                              onToggle={() => {
                                setActiveColorPicker(activeColorPicker === prop.key ? null : prop.key);
                              }}
                              theme={theme}
                              clearable
                              defaultColor={prop.defaultValue as string}
                              themeDefault={(resolvedThemeDefaults as any)[prop.key]}
                              inheritedValue={(inheritedProps as any)[prop.key]}
                            />
                          </div>
                        )}

                        {prop.type === 'select' && (
                          <select
                            value={(resolveProp(prop.key) as string) || prop.options?.[0]?.value}
                            onChange={(e) => updateProp(prop.key, e.target.value)}
                            style={inputStyle}
                          >
                            {prop.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
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
            <Section
              id="colors"
              icon={<Palette style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Colors"
              isExpanded={expandedSections.includes('colors')}
              onToggle={toggleSection}
              theme={theme}
            >
              <ColorPicker
                label="Background Color"
                color={component.props.backgroundColor as string | null | undefined}
                onChange={(color) => updateProp('backgroundColor', color)}
                isOpen={showBgPicker}
                onToggle={() => {
                  setShowBgPicker(!showBgPicker);
                  setShowTextPicker(false);
                }}
                theme={theme}
                clearable
                defaultColor={getDefaultProps(component.type).backgroundColor as string}
                themeDefault={resolvedThemeDefaults.backgroundColor}
                inheritedValue={inheritedProps.backgroundColor}
              />
              <ColorPicker
                label="Text Color"
                color={(component.props as any).textColor as string | null | undefined}
                onChange={(color) => updateProp('textColor', color)}
                isOpen={showTextPicker}
                onToggle={() => {
                  setShowTextPicker(!showTextPicker);
                  setShowBgPicker(false);
                }}
                theme={theme}
                clearable
                defaultColor={getDefaultProps(component.type).textColor as string || getDefaultProps(component.type).color as string}
                themeDefault={resolvedThemeDefaults.textColor}
                inheritedValue={inheritedProps.textColor}
              />
            </Section>

            {/* SPACING Section - Box Model */}
            <Section
              id="spacing"
              icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Spacing"
              isExpanded={expandedSections.includes('spacing')}
              onToggle={toggleSection}
              theme={theme}
            >
              <BoxModelControl
                margin={
                  (component.props.margin as any) ||
                  resolveSpacing('margin') ||
                  { top: '0', right: '0', bottom: '0', left: '0' }
                }
                padding={
                  (component.props.padding as any) ||
                  resolveSpacing('padding') ||
                  { top: '0', right: '0', bottom: '0', left: '0' }
                }
                onMarginChange={(side, value) => {
                  const currentMargin = (component.props.margin as any) ||
                    resolveSpacing('margin') ||
                    { top: '0', right: '0', bottom: '0', left: '0' };
                  if (marginLinked) {
                    updateProp('margin', { top: value, right: value, bottom: value, left: value });
                  } else {
                    updateProp('margin', { ...currentMargin, [side]: value });
                  }
                }}
                onPaddingChange={(side, value) => {
                  const currentPadding = (component.props.padding as any) ||
                    resolveSpacing('padding') ||
                    { top: '0', right: '0', bottom: '0', left: '0' };
                  if (paddingLinked) {
                    updateProp('padding', { top: value, right: value, bottom: value, left: value });
                  } else {
                    updateProp('padding', { ...currentPadding, [side]: value });
                  }
                }}
                marginLinked={marginLinked}
                paddingLinked={paddingLinked}
                onMarginLinkedChange={setMarginLinked}
                onPaddingLinkedChange={setPaddingLinked}
                theme={theme}
              />
            </Section>

            {/* BORDER Section */}
            <Section
              id="border"
              icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Border"
              isExpanded={expandedSections.includes('border')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Width</label>
                  <input
                    type="text"
                    value={(component.props.borderWidth as string) || '0'}
                    onChange={(e) => updateProp('borderWidth', e.target.value)}
                    placeholder="0"
                    style={smallInputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Style</label>
                  <select
                    value={(component.props.borderStyle as string) || 'solid'}
                    onChange={(e) => updateProp('borderStyle', e.target.value)}
                    style={smallInputStyle}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Border Color</label>
                <input
                  type="text"
                  value={(component.props.borderColor as string) || '#e2e8f0'}
                  onChange={(e) => updateProp('borderColor', e.target.value)}
                  placeholder="#e2e8f0"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Border Radius</label>
                <input
                  type="text"
                  value={(component.props.borderRadius as string) || '0'}
                  onChange={(e) => updateProp('borderRadius', e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </Section>

            {/* LAYOUT Section */}
            <Section
              id="layout"
              icon={<Layout style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="Layout"
              isExpanded={expandedSections.includes('layout')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Display</label>
                <select
                  value={(component.props.display as string) || 'block'}
                  onChange={(e) => updateProp('display', e.target.value)}
                  style={inputStyle}
                >
                  <option value="block">Block</option>
                  <option value="inline">Inline</option>
                  <option value="inline-block">Inline Block</option>
                  <option value="flex">Flex</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Flex properties - shown when display is flex */}
              {(component.props.display as string) === 'flex' && (
                <>
                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Flex Direction</label>
                    <select
                      value={(component.props.flexDirection as string) || 'row'}
                      onChange={(e) => updateProp('flexDirection', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="row">Row</option>
                      <option value="row-reverse">Row Reverse</option>
                      <option value="column">Column</option>
                      <option value="column-reverse">Column Reverse</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Flex Wrap</label>
                    <select
                      value={(component.props.flexWrap as string) || 'nowrap'}
                      onChange={(e) => updateProp('flexWrap', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="nowrap">No Wrap</option>
                      <option value="wrap">Wrap</option>
                      <option value="wrap-reverse">Wrap Reverse</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>
                      {((component.props.flexDirection as string) || 'row').includes('column')
                        ? 'Justify Content (Vertical)'
                        : 'Justify Content (Horizontal)'}
                    </label>
                    <select
                      value={(component.props.justifyContent as string) || 'flex-start'}
                      onChange={(e) => updateProp('justifyContent', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="flex-start">Start</option>
                      <option value="flex-end">End</option>
                      <option value="center">Center</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                      <option value="space-evenly">Space Evenly</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>
                      {((component.props.flexDirection as string) || 'row').includes('column')
                        ? 'Align Items (Horizontal)'
                        : 'Align Items (Vertical)'}
                    </label>
                    <select
                      value={(component.props.alignItems as string) || 'stretch'}
                      onChange={(e) => updateProp('alignItems', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Start</option>
                      <option value="flex-end">End</option>
                      <option value="center">Center</option>
                      <option value="baseline">Baseline</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Gap</label>
                    <input
                      type="text"
                      value={(component.props.gap as string) || '0'}
                      onChange={(e) => updateProp('gap', e.target.value)}
                      placeholder="0"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}
            </Section>

            {/* HTML ATTRIBUTES Section */}
            <Section
              id="attributes"
              icon={<Settings style={{ width: 16, height: 16, color: theme.textMuted }} />}
              title="HTML Attributes"
              isExpanded={expandedSections.includes('attributes')}
              onToggle={toggleSection}
              theme={theme}
            >
              <div>
                <label style={labelStyle}>ID</label>
                <input
                  type="text"
                  value={(component.props.htmlId as string) || ''}
                  onChange={(e) => updateProp('htmlId', e.target.value)}
                  placeholder="element-id"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Class</label>
                <input
                  type="text"
                  value={(component.props.htmlClass as string) || ''}
                  onChange={(e) => updateProp('htmlClass', e.target.value)}
                  placeholder="class-name"
                  style={inputStyle}
                />
              </div>
            </Section>
          </div>
        </div>
      </div >
    );
  }

  // Default demo panel (when no component is selected)
  return (
    <div
      style={{
        width: '320px',
        height: '100vh',
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
        <PanelHeader
          componentName="Primary Button"
          componentType="button"
          theme={theme}
        />

        {/* Properties - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {/* CONTENT Section */}
          <Section
            id="content"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Content"
            isExpanded={expandedSections.includes('content')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Button Text</label>
              <input
                type="text"
                value={demoContent}
                onChange={(e) => setDemoContent(e.target.value)}
                placeholder="Enter button text..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Text Alignment</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => { }}
                    style={createButtonGroupStyle(theme, value === 'center')}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Typography section commented out in demo */}

          {/* COLORS Section */}
          <Section
            id="colors"
            icon={<Palette style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Colors"
            isExpanded={expandedSections.includes('colors')}
            onToggle={toggleSection}
            theme={theme}
          >
            <ColorPicker
              label="Background Color"
              color={demoBgColor}
              onChange={(color) => setDemoBgColor(color ?? '#0ea5e9')}
              isOpen={showBgPicker}
              onToggle={() => {
                setShowBgPicker(!showBgPicker);
                setShowTextPicker(false);
              }}
              theme={theme}
              clearable
              defaultColor="#0ea5e9"
              themeDefault={themeDefaults.backgroundColor}
              inheritedValue={themeDefaults.backgroundColor}
            />
            <ColorPicker
              label="Text Color"
              color={demoTextColor}
              onChange={(color) => setDemoTextColor(color ?? '#ffffff')}
              isOpen={showTextPicker}
              onToggle={() => {
                setShowTextPicker(!showTextPicker);
                setShowBgPicker(false);
              }}
              theme={theme}
              clearable
              defaultColor="#ffffff"
              themeDefault={themeDefaults.textColor}
              inheritedValue={themeDefaults.textColor}
            />
            <ColorPicker
              label="Primary Color"
              color={demoPrimaryColor}
              onChange={(color) => setDemoPrimaryColor(color ?? '#2563eb')}
              isOpen={showPrimaryPicker}
              onToggle={() => {
                setShowPrimaryPicker(!showPrimaryPicker);
                setShowBgPicker(false);
                setShowTextPicker(false);
              }}
              theme={theme}
              clearable
              defaultColor="#2563eb"
              themeDefault={themeDefaults.primaryColor}
              inheritedValue={themeDefaults.primaryColor}
            />
          </Section>

          {/* SPACING Section - Box Model */}
          <Section
            id="spacing"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Spacing"
            isExpanded={expandedSections.includes('spacing')}
            onToggle={toggleSection}
            theme={theme}
          >
            <BoxModelControl
              margin={margin}
              padding={padding}
              marginLinked={marginLinked}
              paddingLinked={paddingLinked}
              onMarginChange={handleMarginChange}
              onPaddingChange={handlePaddingChange}
              onMarginLinkedChange={setMarginLinked}
              onPaddingLinkedChange={setPaddingLinked}
              theme={theme}
            />
          </Section>

          {/* BORDER Section */}
          <Section
            id="border"
            icon={<Box style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Border & Shadow"
            isExpanded={expandedSections.includes('border')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.textMuted,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Width
                </span>
                <input
                  type="text"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(e.target.value)}
                  placeholder="0px"
                  style={{ ...inputStyle, height: '32px', fontSize: '12px' }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.textMuted,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Style
                </span>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                  style={{ ...inputStyle, height: '32px', fontSize: '12px' }}
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.textMuted,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Color
                </span>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    height: '32px',
                    padding: '0 8px',
                    backgroundColor: theme.bgSecondary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderSecondary}`,
                      backgroundColor: borderColor,
                    }}
                  />
                </button>
              </div>
            </div>
            {/* Border Radius */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.textMuted,
                  }}
                >
                  Radius
                </span>
                <button
                  onClick={() => setRadiusLinked(!radiusLinked)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: radiusLinked ? theme.primaryBg : theme.bgTertiary,
                    color: radiusLinked ? theme.primaryText : theme.textMuted,
                  }}
                >
                  {radiusLinked ? (
                    <Link2 style={{ width: 12, height: 12 }} />
                  ) : (
                    <Link2Off style={{ width: 12, height: 12 }} />
                  )}
                  <span>{radiusLinked ? 'Linked' : 'Individual'}</span>
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { key: 'tl', label: 'TL' },
                  { key: 'tr', label: 'TR' },
                  { key: 'bl', label: 'BL' },
                  { key: 'br', label: 'BR' },
                ].map(({ key }) => (
                  <div
                    key={key}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: theme.textMuted,
                        ...(key === 'tl' && {
                          borderBottom: 'none',
                          borderRight: 'none',
                          borderTopLeftRadius: '4px',
                        }),
                        ...(key === 'tr' && {
                          borderBottom: 'none',
                          borderLeft: 'none',
                          borderTopRightRadius: '4px',
                        }),
                        ...(key === 'bl' && {
                          borderTop: 'none',
                          borderRight: 'none',
                          borderBottomLeftRadius: '4px',
                        }),
                        ...(key === 'br' && {
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderBottomRightRadius: '4px',
                        }),
                      }}
                    />
                    <input
                      type="text"
                      value={borderRadius[key as keyof typeof borderRadius]}
                      onChange={(e) =>
                        handleRadiusChange(key as keyof typeof borderRadius, e.target.value)
                      }
                      style={smallInputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Box Shadow</label>
              <select style={inputStyle}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
          </Section>

          {/* LAYOUT Section */}
          <Section
            id="layout"
            icon={<Layout style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Layout"
            isExpanded={expandedSections.includes('layout')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Width</label>
                <input type="text" placeholder="auto" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Height</label>
                <input type="text" placeholder="auto" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Display</label>
              <select style={inputStyle}>
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="inline-flex">Inline Flex</option>
                <option value="grid">Grid</option>
              </select>
            </div>
          </Section>

          {/* LINK Section */}
          <Section
            id="link"
            icon={<Link style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Link Settings"
            isExpanded={expandedSections.includes('link')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>URL</label>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Target</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={inputStyle}
              >
                <option value="_self">Same Window</option>
                <option value="_blank">New Tab</option>
                <option value="_parent">Parent Frame</option>
                <option value="_top">Top Frame</option>
              </select>
            </div>
          </Section>

          {/* HTML ATTRIBUTES Section */}
          <Section
            id="attributes"
            icon={<Settings style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="HTML Attributes"
            badge="Advanced"
            isExpanded={expandedSections.includes('attributes')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>ID</label>
              <input
                type="text"
                value={htmlId}
                onChange={(e) => setHtmlId(e.target.value)}
                placeholder="my-button"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Class</label>
              <input
                type="text"
                value={htmlClass}
                onChange={(e) => setHtmlClass(e.target.value)}
                placeholder="btn btn-primary"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" placeholder="Tooltip text" style={inputStyle} />
            </div>

            {/* Accessibility */}
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
              <h4
                style={{ fontSize: '12px', fontWeight: 500, color: theme.textMuted, marginBottom: '12px' }}
              >
                Accessibility
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>ARIA Label</label>
                  <input type="text" placeholder="Descriptive label" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select style={inputStyle}>
                    <option value="">Default</option>
                    <option value="button">Button</option>
                    <option value="link">Link</option>
                    <option value="menuitem">Menu Item</option>
                  </select>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <PanelFooter componentId="a1b2c3d4" theme={theme} />
      </div>
    </div>
  );
};
