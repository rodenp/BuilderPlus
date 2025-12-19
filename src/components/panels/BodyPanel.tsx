import React, { useState, useMemo } from 'react';
import {
    Palette,
    Type,
    Layout,
    ChevronDown,
    ChevronRight,
    Globe,
    Settings2,
    Sparkles,
    Undo2
} from 'lucide-react';
import type { BodySettings } from '../../types/bodySettings';
import { globalStyleRegistry } from '../../config/style-properties';
import { globalThemeRegistry } from '../../core/theme-registry';
import { ColorPicker } from './property-panel/ColorPicker';

interface BodyPanelProps {
    theme: any; // UI Theme
    bodySettings: BodySettings;
    onBodySettingsChange: (settings: BodySettings) => void;
}

const SECTION_ICONS: Record<string, any> = {
    'Palette': Palette,
    'Type': Type,
    'Layout': Layout,
    'Settings': Settings2,
    'Sparkles': Sparkles
};

const Section: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: (id: string) => void;
    theme: any;
    children: React.ReactNode;
}> = ({ id, title, icon, isExpanded, onToggle, theme, children }) => (
    <div style={{ borderBottom: `1px solid ${theme.border}` }}>
        <button
            onClick={() => onToggle(id)}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.text,
                cursor: 'pointer',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{title}</span>
            </div>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {isExpanded && (
            <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {children}
            </div>
        )}
    </div>
);

export const BodyPanel: React.FC<BodyPanelProps> = ({
    theme,
    bodySettings,
    onBodySettingsChange,
}) => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['colors', 'global-colors', 'meta']);
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    // Resolve base theme
    const activeThemeObject = useMemo(() => {
        const systemTheme = globalThemeRegistry.getTheme(bodySettings.activeCanvasThemeId);
        if (systemTheme) return systemTheme;
        return bodySettings.customThemes.find(t => t.id === bodySettings.activeCanvasThemeId) ||
            globalThemeRegistry.getTheme('light')!;
    }, [bodySettings.activeCanvasThemeId, bodySettings.customThemes]);

    const overrides = bodySettings.styleOverrides || {};

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const updateOverride = (key: string, value: any) => {
        const newOverrides = { ...overrides };
        if (value === undefined || value === null || value === '') {
            delete newOverrides[key];
        } else {
            newOverrides[key] = value;
        }

        onBodySettingsChange({
            ...bodySettings,
            styleOverrides: newOverrides
        });
    };

    const resetOverride = (key: string) => {
        const newOverrides = { ...overrides };
        delete newOverrides[key];
        onBodySettingsChange({
            ...bodySettings,
            styleOverrides: newOverrides
        });
    };

    const groups = globalStyleRegistry.getGroups();

    // Helper to render label with reset button
    const LabelWithReset = ({ label, propKey, isOverridden }: { label: string, propKey: string, isOverridden: boolean }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', color: theme.textMuted }}>{label}</label>
            {isOverridden && (
                <button
                    onClick={() => resetOverride(propKey)}
                    title="Reset to theme default"
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: theme.primary,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Undo2 size={12} />
                </button>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.bg }}>
            {/* Header / Theme Info */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: theme.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Active Theme
                </div>
                <div style={{
                    padding: '8px 12px',
                    backgroundColor: theme.bgSecondary,
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Palette size={14} color={theme.primary} />
                    {activeThemeObject.name}
                </div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                    Changes made here override the active theme for this page.
                </div>
            </div>

            {/* Scrollable Properties */}
            <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* Meta Section */}
                <Section
                    id="meta"
                    title="Page Metadata"
                    icon={<Globe size={16} color={theme.textMuted} />}
                    isExpanded={expandedSections.includes('meta')}
                    onToggle={toggleSection}
                    theme={theme}
                >
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Page Title</label>
                        <input
                            type="text"
                            value={bodySettings.pageTitle}
                            onChange={(e) => onBodySettingsChange({ ...bodySettings, pageTitle: e.target.value })}
                            placeholder="My Page Title"
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Meta Description</label>
                        <textarea
                            value={bodySettings.metaDescription}
                            onChange={(e) => onBodySettingsChange({ ...bodySettings, metaDescription: e.target.value })}
                            placeholder="Page description..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                minHeight: '60px',
                                borderRadius: '6px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </Section>

                {/* Dynamic Style Groups */}
                {groups.map(group => {
                    const Icon = SECTION_ICONS[group.icon] || Settings2;
                    return (
                        <Section
                            key={group.id}
                            id={group.id}
                            title={group.title}
                            icon={<Icon size={16} color={theme.textMuted} />}
                            isExpanded={expandedSections.includes(group.id)}
                            onToggle={toggleSection}
                            theme={theme}
                        >
                            {group.properties.map(prop => {
                                // Value logic: Override > Theme > Fallback
                                const themeValue = activeThemeObject.styles[prop.key];
                                const overrideValue = overrides[prop.key];
                                const currentValue = overrideValue !== undefined ? overrideValue : (themeValue !== undefined ? themeValue : prop.systemFallback);
                                const isOverridden = overrideValue !== undefined;

                                if (prop.type === 'color') {
                                    return (
                                        <div key={prop.key}>
                                            <LabelWithReset label={prop.label} propKey={prop.key} isOverridden={isOverridden} />
                                            <ColorPicker
                                                label="" // Label handled above
                                                color={currentValue as string}
                                                onChange={(val) => updateOverride(prop.key, val)}
                                                isOpen={activeColorPicker === prop.key}
                                                onToggle={() => setActiveColorPicker(activeColorPicker === prop.key ? null : prop.key)}
                                                theme={theme}
                                                themeDefault={(themeValue || prop.systemFallback || '').toString()}
                                                clearable
                                            />
                                        </div>
                                    );
                                }

                                if (prop.type === 'select') {
                                    return (
                                        <div key={prop.key}>
                                            <LabelWithReset label={prop.label} propKey={prop.key} isOverridden={isOverridden} />
                                            <select
                                                value={(currentValue as string) || ''}
                                                onChange={(e) => updateOverride(prop.key, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    border: isOverridden ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
                                                    backgroundColor: theme.bgSecondary,
                                                    color: theme.text,
                                                    outline: 'none'
                                                }}
                                            >
                                                {prop.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={prop.key}>
                                        <LabelWithReset label={prop.label} propKey={prop.key} isOverridden={isOverridden} />
                                        <input
                                            type="text"
                                            value={(currentValue as string) || ''}
                                            onChange={(e) => updateOverride(prop.key, e.target.value)}
                                            placeholder={prop.placeholder}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: isOverridden ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
                                                backgroundColor: theme.bgSecondary,
                                                color: theme.text,
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </Section>
                    );
                })}
            </div>
        </div>
    );
};
