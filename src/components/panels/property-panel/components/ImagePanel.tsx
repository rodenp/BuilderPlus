
import React from 'react';
import { Image, FolderOpen } from 'lucide-react';
import { Section } from '../Section';
import { createInputStyle, createLabelStyle } from '../styles';
import type { ComponentPanelProps } from './types';
import type { MediaItem } from '../../../../types/media';

export const ImagePanel: React.FC<ComponentPanelProps> = ({
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
};
