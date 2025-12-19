import React, { useState } from 'react';
import {
    Image,
    Globe
} from 'lucide-react';
import type { Theme as UITheme } from './property-panel/theme';
import type { BodySettings } from '../../types/bodySettings';
import { Section } from './property-panel/Section';

interface PagePanelProps {
    theme: UITheme;
    bodySettings: BodySettings;
    onBodySettingsChange: (settings: BodySettings) => void;
}

export const PagePanel: React.FC<PagePanelProps> = ({
    theme,
    bodySettings,
    onBodySettingsChange,
}) => {
    // Accordion state
    const [expandedSections, setExpandedSections] = useState<string[]>([
        'meta',
    ]);

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
                        <Globe style={{ width: 16, height: 16, color: theme.primaryText }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>
                            Page Settings
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
                            SEO & Metadata
                        </p>
                    </div>
                </div>

                {/* Properties - Scrollable */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
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
                                value={bodySettings.pageTitle || ''}
                                onChange={(e) => updateSetting('pageTitle', e.target.value)}
                                placeholder="My Page Title"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Meta Description</label>
                            <textarea
                                value={bodySettings.metaDescription || ''}
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
                                value={bodySettings.faviconUrl || ''}
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
