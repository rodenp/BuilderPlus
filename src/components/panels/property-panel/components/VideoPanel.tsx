
import React from 'react';
import { Video, FolderOpen } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';

export const VideoPanel: React.FC<ComponentPanelProps> = ({
    component,
    theme,
    updateProp,
    onOpenMediaGallery,
    expandedSections,
    toggleSection,
}) => {
    const inputStyle = createInputStyle(theme);
    const labelStyle = createLabelStyle(theme);

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
};
