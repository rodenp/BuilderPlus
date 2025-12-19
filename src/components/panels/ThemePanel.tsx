import React, { useState } from 'react';
import {
    Palette,
    Type,
    Layout,
    ChevronDown,
    ChevronRight,
    Copy,
    Trash2,
    Settings2,
    Sparkles,
    Plus,
    Edit3,
    ArrowLeft,
    Monitor,
    MousePointer2
} from 'lucide-react';
import type { BodySettings } from '../../types/bodySettings';
import type { Theme } from '../../types/theme';
import { globalStyleRegistry } from '../../config/style-properties';
import { globalThemeRegistry } from '../../core/theme-registry';
import { ColorPicker } from './property-panel/ColorPicker';

interface ThemePanelProps {
    theme: any; // UI Theme
    bodySettings: BodySettings;
    onBodySettingsChange: (settings: BodySettings) => void;
}

// --- SUB-COMPONENTS ---

const ThemeCard: React.FC<{
    themeItem: Theme;
    isActiveCanvas: boolean;
    isActiveUI: boolean;
    onEdit: () => void;
    onSetCanvas: () => void;
    onSetUI: () => void;
    onDuplicate: () => void;
    onDelete?: () => void;
    uiTheme: any;
}> = ({ themeItem, isActiveCanvas, isActiveUI, onEdit, onSetCanvas, onSetUI, onDuplicate, onDelete, uiTheme }) => {
    return (
        <div style={{
            border: `1px solid ${isActiveCanvas ? uiTheme.primary : uiTheme.border}`,
            backgroundColor: uiTheme.bgSecondary,
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative'
        }}>
            {/* Header / Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: uiTheme.text }}>{themeItem.name}</div>
                    <div style={{ fontSize: '11px', color: uiTheme.textMuted, marginTop: '2px' }}>
                        {themeItem.description || (themeItem.mode === 'dark' ? 'Dark Mode' : 'Light Mode')}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {/* Preview Colors */}
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: (themeItem.styles.primaryColor as string) || '#0ea5e9' }} title="Primary" />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: (themeItem.styles.backgroundColor as string) || '#ffffff', border: '1px solid #ccc' }} title="Background" />
                </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {isActiveCanvas && (
                    <span style={{ fontSize: '10px', backgroundColor: uiTheme.primaryBg, color: uiTheme.primaryText, padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                        Active Canvas
                    </span>
                )}
                {isActiveUI && (
                    <span style={{ fontSize: '10px', backgroundColor: uiTheme.marginBg, color: uiTheme.marginText, padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                        Active UI
                    </span>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <button title="Edit Theme" onClick={onEdit} style={{ flex: 1, padding: '6px', cursor: 'pointer', border: `1px solid ${uiTheme.border}`, borderRadius: '4px', background: uiTheme.bg, color: uiTheme.text }}>
                    <Edit3 size={14} style={{ margin: '0 auto' }} />
                </button>
                <button title="Apply to Canvas" onClick={onSetCanvas} style={{ flex: 1, padding: '6px', cursor: 'pointer', border: `1px solid ${!isActiveCanvas ? uiTheme.border : uiTheme.primary}`, borderRadius: '4px', background: isActiveCanvas ? uiTheme.primaryBg : uiTheme.bg, color: isActiveCanvas ? uiTheme.primaryText : uiTheme.text }}>
                    <MousePointer2 size={14} style={{ margin: '0 auto' }} />
                </button>
                <button title="Apply to UI" onClick={onSetUI} style={{ flex: 1, padding: '6px', cursor: 'pointer', border: `1px solid ${!isActiveUI ? uiTheme.border : uiTheme.marginBorder}`, borderRadius: '4px', background: isActiveUI ? uiTheme.marginBg : uiTheme.bg, color: isActiveUI ? uiTheme.marginText : uiTheme.text }}>
                    <Monitor size={14} style={{ margin: '0 auto' }} />
                </button>
                <button title="Duplicate" onClick={onDuplicate} style={{ flex: 1, padding: '6px', cursor: 'pointer', border: `1px solid ${uiTheme.border}`, borderRadius: '4px', background: uiTheme.bg, color: uiTheme.text }}>
                    <Copy size={14} style={{ margin: '0 auto' }} />
                </button>
                {onDelete && (
                    <button title="Delete" onClick={onDelete} style={{ flex: 1, padding: '6px', cursor: 'pointer', border: `1px solid ${uiTheme.border}`, borderRadius: '4px', background: uiTheme.bg, color: uiTheme.error || '#ef4444' }}>
                        <Trash2 size={14} style={{ margin: '0 auto' }} />
                    </button>
                )}
            </div>
        </div>
    );
};

const ThemeEditor: React.FC<{
    themeItem: Theme;
    isSystem: boolean;
    onSave: (updated: Theme) => void;
    onBack: () => void;
    uiTheme: any;
}> = ({ themeItem, isSystem, onSave, onBack, uiTheme }) => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['colors', 'Typography']);
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    // Local state for editing form inputs
    const handleChange = (field: keyof Theme, value: any) => {
        onSave({ ...themeItem, [field]: value });
    };

    const handleStyleChange = (key: string, value: any) => {
        onSave({
            ...themeItem,
            styles: { ...themeItem.styles, [key]: value }
        });
    };

    const groups = globalStyleRegistry.getGroups();
    const SECTION_ICONS: Record<string, any> = {
        'Palette': Palette,
        'Type': Type,
        'Layout': Layout,
        'Settings': Settings2,
        'Sparkles': Sparkles
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Editor Header */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${uiTheme.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: uiTheme.text }}>
                    <ArrowLeft size={16} />
                </button>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Edit Theme</span>
            </div>

            <div style={{ padding: '16px', borderBottom: `1px solid ${uiTheme.border}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Meta Fields */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: uiTheme.textMuted, textTransform: 'uppercase' }}>Name</label>
                    <input
                        type="text"
                        disabled={isSystem}
                        value={themeItem.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${uiTheme.border}`, background: uiTheme.bgSecondary, color: uiTheme.text }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: uiTheme.textMuted, textTransform: 'uppercase' }}>Description</label>
                    <input
                        type="text"
                        disabled={isSystem}
                        value={themeItem.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Optional description..."
                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${uiTheme.border}`, background: uiTheme.bgSecondary, color: uiTheme.text }}
                    />
                </div>
            </div>

            {/* Style Properties */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {groups.map(group => {
                    const Icon = SECTION_ICONS[group.icon] || Settings2;
                    const isExpanded = expandedSections.includes(group.id);

                    return (
                        <div key={group.id} style={{ borderBottom: `1px solid ${uiTheme.border}` }}>
                            <button
                                onClick={() => setExpandedSections(prev => prev.includes(group.id) ? prev.filter(x => x !== group.id) : [...prev, group.id])}
                                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'transparent', border: 'none', color: uiTheme.text, cursor: 'pointer', alignItems: 'center' }}
                            >
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <Icon size={16} color={uiTheme.textMuted} />
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{group.title}</span>
                                </div>
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isExpanded && (
                                <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {group.properties.map(prop => {
                                        const value = themeItem.styles[prop.key];

                                        if (prop.type === 'color') {
                                            return (
                                                <ColorPicker
                                                    key={prop.key}
                                                    label={prop.label}
                                                    color={value as string}
                                                    onChange={(val) => handleStyleChange(prop.key, val)}
                                                    isOpen={activeColorPicker === prop.key}
                                                    onToggle={() => setActiveColorPicker(activeColorPicker === prop.key ? null : prop.key)}
                                                    theme={uiTheme}
                                                    themeDefault={prop.systemFallback as string}
                                                    disabled={isSystem}
                                                    clearable
                                                />
                                            );
                                        }

                                        if (prop.type === 'select') {
                                            return (
                                                <div key={prop.key}>
                                                    <label style={{ display: 'block', fontSize: '12px', color: uiTheme.textMuted, marginBottom: '6px' }}>{prop.label}</label>
                                                    <select
                                                        disabled={isSystem}
                                                        value={(value as string) || ''}
                                                        onChange={(e) => handleStyleChange(prop.key, e.target.value)}
                                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${uiTheme.border}`, backgroundColor: uiTheme.bgSecondary, color: uiTheme.text, opacity: isSystem ? 0.6 : 1 }}
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
                                                <label style={{ display: 'block', fontSize: '12px', color: uiTheme.textMuted, marginBottom: '6px' }}>{prop.label}</label>
                                                <input
                                                    disabled={isSystem}
                                                    type="text"
                                                    value={(value as string) || ''}
                                                    onChange={(e) => handleStyleChange(prop.key, e.target.value)}
                                                    placeholder={prop.placeholder}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${uiTheme.border}`, backgroundColor: uiTheme.bgSecondary, color: uiTheme.text, opacity: isSystem ? 0.6 : 1 }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN PANEL ---

export const ThemePanel: React.FC<ThemePanelProps> = ({
    theme, // UI Theme
    bodySettings,
    onBodySettingsChange,
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'edit'>('grid');
    const [editingThemeId, setEditingThemeId] = useState<string | null>(null);

    const activeCanvasId = bodySettings.activeCanvasThemeId;
    const activeUIId = bodySettings.activeUIThemeId;

    // Derived Lists
    const systemThemes = globalThemeRegistry.getAllThemes();
    const customThemes = bodySettings.customThemes;
    const allThemes = [...systemThemes, ...customThemes];

    // Helper to get full theme object
    const getThemeById = (id: string) => {
        return [...systemThemes, ...customThemes].find(t => t.id === id);
    };

    const handleCreateNew = () => {
        const newId = `custom-theme-${Date.now()}`;
        const newTheme: Theme = {
            id: newId,
            name: 'New Custom Theme',
            description: 'Created via Theme Panel',
            mode: 'light',
            styles: { ...globalThemeRegistry.getTheme('light')?.styles }
        };

        onBodySettingsChange({
            ...bodySettings,
            customThemes: [...bodySettings.customThemes, newTheme]
        });

        // Immediately edit
        setEditingThemeId(newId);
        setViewMode('edit');
    };

    const handleDuplicate = (source: Theme) => {
        const newId = `${source.id}-copy-${Date.now()}`;
        const newTheme: Theme = {
            ...source,
            id: newId,
            name: `${source.name} (Copy)`,
            description: `Copy of ${source.name}`,
            styles: { ...source.styles }
        };

        onBodySettingsChange({
            ...bodySettings,
            customThemes: [...bodySettings.customThemes, newTheme]
        });
    };

    const handleDelete = (id: string) => {
        // Prevent deleting active themes
        if (id === activeCanvasId || id === activeUIId) {
            alert("Cannot delete a theme that is currently active on Canvas or UI.");
            return;
        }
        onBodySettingsChange({
            ...bodySettings,
            customThemes: bodySettings.customThemes.filter(t => t.id !== id)
        });
    };

    const handleUpdateTheme = (updated: Theme) => {
        // Only update Custom Themes
        const index = bodySettings.customThemes.findIndex(t => t.id === updated.id);
        if (index === -1) return; // Should not happen for system themes in edit mode

        const newCustoms = [...bodySettings.customThemes];
        newCustoms[index] = updated;

        onBodySettingsChange({
            ...bodySettings,
            customThemes: newCustoms
        });
    };

    // Render Logic
    if (viewMode === 'edit' && editingThemeId) {
        const targetTheme = getThemeById(editingThemeId);
        if (!targetTheme) return <div>Error: Theme not found</div>;

        const isSystem = systemThemes.some(t => t.id === editingThemeId);

        return (
            <div style={{ height: '100%', backgroundColor: theme.bg }}>
                <ThemeEditor
                    themeItem={targetTheme}
                    isSystem={isSystem}
                    onSave={handleUpdateTheme}
                    onBack={() => setViewMode('grid')}
                    uiTheme={theme}
                />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.bg }}>
            {/* Header / Toolbar */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: theme.text }}>Themes</span>
                <button
                    onClick={handleCreateNew}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '6px',
                        backgroundColor: theme.primary, color: theme.primaryText,
                        border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer'
                    }}
                >
                    <Plus size={14} /> New
                </button>
            </div>

            {/* Grid Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allThemes.map(t => (
                    <ThemeCard
                        key={t.id}
                        themeItem={t}
                        isActiveCanvas={activeCanvasId === t.id}
                        isActiveUI={activeUIId === t.id}
                        uiTheme={theme}
                        onEdit={() => {
                            setEditingThemeId(t.id);
                            setViewMode('edit');
                        }}
                        onSetCanvas={() => onBodySettingsChange({ ...bodySettings, activeCanvasThemeId: t.id })}
                        onSetUI={() => onBodySettingsChange({ ...bodySettings, activeUIThemeId: t.id })}
                        onDuplicate={() => handleDuplicate(t)}
                        onDelete={bodySettings.customThemes.find(c => c.id === t.id) ? () => handleDelete(t.id) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};
