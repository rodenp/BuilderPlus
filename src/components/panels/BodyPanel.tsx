import React, { useState } from 'react';
import {
  Type,
  Palette,
  Layout,
  Image,
} from 'lucide-react';
import type { Theme } from './property-panel/theme';
import type { BodySettings } from '../../types/bodySettings';
import { getDefaultCanvasColors } from '../../types/bodySettings';
import { Section } from './property-panel/Section';
import { ColorPicker } from './property-panel/ColorPicker';

interface BodyPanelProps {
  theme: Theme;
  bodySettings: BodySettings;
  onBodySettingsChange: (settings: BodySettings) => void;
  isCanvasDark: boolean;
}

export const BodyPanel: React.FC<BodyPanelProps> = ({
  theme,
  bodySettings,
  onBodySettingsChange,
  isCanvasDark,
}) => {
  // Accordion state
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'background',
    'typography',
  ]);

  // Color picker state
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [showLinkPicker, setShowLinkPicker] = useState(false);

  const defaultColors = getDefaultCanvasColors(isCanvasDark);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const updateSetting = <K extends keyof BodySettings>(
    key: K,
    value: BodySettings[K]
  ) => {
    onBodySettingsChange({
      ...bodySettings,
      [key]: value,
    });
  };

  // Style helpers
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    padding: '0 12px',
    fontSize: '14px',
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '6px',
    color: theme.text,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.textMuted,
    marginBottom: '6px',
    display: 'block',
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
            <Palette style={{ width: 16, height: 16, color: theme.primaryText }} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>
              Body Settings
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
              Page styles
            </p>
          </div>
        </div>

        {/* Properties - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {/* BACKGROUND Section */}
          <Section
            id="background"
            icon={<Palette style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Background"
            isExpanded={expandedSections.includes('background')}
            onToggle={toggleSection}
            theme={theme}
          >
            <ColorPicker
              label="Background Color"
              color={bodySettings.backgroundColor}
              onChange={(color) => updateSetting('backgroundColor', color)}
              isOpen={showBgPicker}
              onToggle={() => {
                setShowBgPicker(!showBgPicker);
                setShowTextPicker(false);
                setShowLinkPicker(false);
              }}
              theme={theme}
              defaultColor={defaultColors.backgroundColor}
              clearable
            />

            <div>
              <label style={labelStyle}>Background Image URL</label>
              <input
                type="text"
                value={bodySettings.backgroundImage}
                onChange={(e) => updateSetting('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={inputStyle}
              />
            </div>

            {bodySettings.backgroundImage && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Size</label>
                    <select
                      value={bodySettings.backgroundSize}
                      onChange={(e) => updateSetting('backgroundSize', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="auto">Auto</option>
                      <option value="100% 100%">Stretch</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Position</label>
                    <select
                      value={bodySettings.backgroundPosition}
                      onChange={(e) => updateSetting('backgroundPosition', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Repeat</label>
                  <select
                    value={bodySettings.backgroundRepeat}
                    onChange={(e) => updateSetting('backgroundRepeat', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="no-repeat">No Repeat</option>
                    <option value="repeat">Repeat</option>
                    <option value="repeat-x">Repeat X</option>
                    <option value="repeat-y">Repeat Y</option>
                  </select>
                </div>
              </>
            )}
          </Section>

          {/* TYPOGRAPHY Section */}
          <Section
            id="typography"
            icon={<Type style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Typography"
            isExpanded={expandedSections.includes('typography')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Font Family</label>
              <select
                value={bodySettings.fontFamily}
                onChange={(e) => updateSetting('fontFamily', e.target.value)}
                style={inputStyle}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Source Sans Pro">Source Sans Pro</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Base Font Size</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    value={bodySettings.baseFontSize}
                    onChange={(e) => updateSetting('baseFontSize', e.target.value)}
                    style={{ ...inputStyle, width: '70%' }}
                  />
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>px</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Line Height</label>
                <input
                  type="text"
                  value={bodySettings.baseLineHeight}
                  onChange={(e) => updateSetting('baseLineHeight', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <ColorPicker
              label="Text Color"
              color={bodySettings.textColor}
              onChange={(color) => updateSetting('textColor', color)}
              isOpen={showTextPicker}
              onToggle={() => {
                setShowTextPicker(!showTextPicker);
                setShowBgPicker(false);
                setShowLinkPicker(false);
              }}
              theme={theme}
              defaultColor={defaultColors.textColor}
              clearable
            />

            <ColorPicker
              label="Link Color"
              color={bodySettings.linkColor}
              onChange={(color) => updateSetting('linkColor', color)}
              isOpen={showLinkPicker}
              onToggle={() => {
                setShowLinkPicker(!showLinkPicker);
                setShowBgPicker(false);
                setShowTextPicker(false);
              }}
              theme={theme}
              defaultColor={defaultColors.linkColor}
              clearable
            />
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
            <div>
              <label style={labelStyle}>Content Width</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="text"
                  value={bodySettings.contentWidth}
                  onChange={(e) => updateSetting('contentWidth', e.target.value)}
                  style={{ ...inputStyle, width: '80%' }}
                />
                <span style={{ fontSize: '12px', color: theme.textMuted }}>px</span>
              </div>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                Maximum width of the content area
              </p>
            </div>

            <div>
              <label style={labelStyle}>Content Padding</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="text"
                  value={bodySettings.contentPadding}
                  onChange={(e) => updateSetting('contentPadding', e.target.value)}
                  style={{ ...inputStyle, width: '80%' }}
                />
                <span style={{ fontSize: '12px', color: theme.textMuted }}>px</span>
              </div>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                Padding on left and right sides
              </p>
            </div>
          </Section>

          {/* META Section */}
          <Section
            id="meta"
            icon={<Image style={{ width: 16, height: 16, color: theme.textMuted }} />}
            title="Meta & SEO"
            isExpanded={expandedSections.includes('meta')}
            onToggle={toggleSection}
            theme={theme}
          >
            <div>
              <label style={labelStyle}>Page Title</label>
              <input
                type="text"
                value={bodySettings.pageTitle}
                onChange={(e) => updateSetting('pageTitle', e.target.value)}
                placeholder="My Page Title"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                value={bodySettings.metaDescription}
                onChange={(e) => updateSetting('metaDescription', e.target.value)}
                placeholder="A brief description of your page..."
                style={{
                  ...inputStyle,
                  height: '80px',
                  padding: '8px 12px',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Favicon URL</label>
              <input
                type="text"
                value={bodySettings.faviconUrl}
                onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                placeholder="https://example.com/favicon.ico"
                style={inputStyle}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
