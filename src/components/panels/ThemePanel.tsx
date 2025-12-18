import React, { useState } from 'react';
import {
    Palette,
    Type,
    Layout,
    ChevronDown,
    ChevronRight,
    Sun,
    Moon,
    RotateCcw
} from 'lucide-react';
import type { BodySettings } from '../../types/bodySettings';
import { globalStyleRegistry } from '../../config/style-properties';
import { ColorPicker } from './property-panel/ColorPicker';

interface ThemePanelProps {
    theme: any;
    bodySettings: BodySettings;
    onBodySettingsChange: (settings: BodySettings) => void;
    isCanvasDark: boolean;
}

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

export const ThemePanel: React.FC<ThemePanelProps> = ({
    theme,
    bodySettings,
    onBodySettingsChange,
    isCanvasDark
}) => {
    const [activeMode, setActiveMode] = useState<'light' | 'dark'>(isCanvasDark ? 'dark' : 'light');
    const [expandedSections, setExpandedSections] = useState<string[]>(['global-colors']);
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    // Safety check and automatic migration for legacy data
    React.useEffect(() => {
        if (!bodySettings.theme || !bodySettings.theme.light || !bodySettings.theme.dark) {
            const legacy = bodySettings as any;
            const newTheme = {
                light: {
                    backgroundColor: legacy.backgroundColor || '#ffffff',
                    backgroundImage: legacy.backgroundImage || '',
                    backgroundSize: legacy.backgroundSize || 'cover',
                    backgroundPosition: legacy.backgroundPosition || 'center',
                    backgroundRepeat: legacy.backgroundRepeat || 'no-repeat',
                    fontFamily: legacy.fontFamily || 'Inter',
                    fontSize: legacy.baseFontSize || '16px',
                    lineHeight: legacy.baseLineHeight || '1.5',
                    textColor: legacy.textColor || '#171717',
                    linkColor: legacy.linkColor || '#2563eb',
                },
                dark: {
                    backgroundColor: legacy.backgroundColor || '#1e1e1e',
                    backgroundImage: legacy.backgroundImage || '',
                    backgroundSize: legacy.backgroundSize || 'cover',
                    backgroundPosition: legacy.backgroundPosition || 'center',
                    backgroundRepeat: legacy.backgroundRepeat || 'no-repeat',
                    fontFamily: legacy.fontFamily || 'Inter',
                    fontSize: legacy.baseFontSize || '16px',
                    lineHeight: legacy.baseLineHeight || '1.5',
                    textColor: legacy.textColor || '#e5e5e5',
                    linkColor: legacy.linkColor || '#60a5fa',
                }
            };

            onBodySettingsChange({
                ...bodySettings,
                theme: newTheme,
                defaultMode: 'system'
            });
        }
    }, [bodySettings, onBodySettingsChange]);

    if (!bodySettings.theme || !bodySettings.theme.light || !bodySettings.theme.dark) {
        return (
            <div style={{ padding: '20px', color: theme.textMuted, fontSize: '13px', textAlign: 'center' }}>
                Migrating theme data...
            </div>
        );
    }

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const updateStyle = (key: string, value: any) => {
        onBodySettingsChange({
            ...bodySettings,
            theme: {
                ...bodySettings.theme,
                [activeMode]: {
                    ...bodySettings.theme[activeMode],
                    [key]: value
                }
            }
        });
    };

    const resetToDefaults = () => {
        const groups = globalStyleRegistry.getGroups();
        const defaults: any = {};
        groups.forEach(group => {
            group.properties.forEach(prop => {
                defaults[prop.key] = prop.defaultValue[activeMode];
            });
        });

        onBodySettingsChange({
            ...bodySettings,
            theme: {
                ...bodySettings.theme,
                [activeMode]: defaults
            }
        });
    };

    const groups = globalStyleRegistry.getGroups();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.bg }}>
            {/* Mode Selector */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Editing Theme Instance
                </div>
                <div style={{ display: 'flex', backgroundColor: theme.bgSecondary, padding: '4px', borderRadius: '8px', gap: '4px' }}>
                    <button
                        onClick={() => setActiveMode('light')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: activeMode === 'light' ? theme.bg : 'transparent',
                            color: activeMode === 'light' ? theme.text : theme.textMuted,
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                            boxShadow: activeMode === 'light' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Sun size={14} /> Light
                    </button>
                    <button
                        onClick={() => setActiveMode('dark')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: activeMode === 'dark' ? theme.bg : 'transparent',
                            color: activeMode === 'dark' ? theme.text : theme.textMuted,
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                            boxShadow: activeMode === 'dark' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Moon size={14} /> Dark
                    </button>
                </div>
            </div>

            {/* Scrollable Properties */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {groups.map(group => {
                    const Icon = group.icon === 'Palette' ? Palette : group.icon === 'Type' ? Type : Layout;
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
                                if (prop.type === 'color') {
                                    return (
                                        <ColorPicker
                                            key={prop.key}
                                            label={prop.label}
                                            color={bodySettings.theme?.[activeMode]?.[prop.key] as string}
                                            onChange={(val) => updateStyle(prop.key, val)}
                                            isOpen={activeColorPicker === prop.key}
                                            onToggle={() => setActiveColorPicker(activeColorPicker === prop.key ? null : prop.key)}
                                            theme={theme}
                                            themeDefault={prop.defaultValue[activeMode] as string}
                                            clearable
                                        />
                                    );
                                }

                                if (prop.type === 'select') {
                                    return (
                                        <div key={prop.key}>
                                            <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>{prop.label}</label>
                                            <select
                                                value={(bodySettings.theme?.[activeMode]?.[prop.key] as string) || ''}
                                                onChange={(e) => updateStyle(prop.key, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    border: `1px solid ${theme.border}`,
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
                                        <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>{prop.label}</label>
                                        <input
                                            type="text"
                                            value={(bodySettings.theme?.[activeMode]?.[prop.key] as string) || ''}
                                            onChange={(e) => updateStyle(prop.key, e.target.value)}
                                            placeholder={prop.placeholder}
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
                                );
                            })}
                        </Section>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px', borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bgSecondary }}>
                <button
                    onClick={resetToDefaults}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bg,
                        color: theme.text,
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500
                    }}
                >
                    <RotateCcw size={14} /> Reset {activeMode} Theme
                </button>
            </div>
        </div>
    );
};
