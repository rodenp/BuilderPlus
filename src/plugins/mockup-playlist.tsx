import React from 'react';
import {
    registerPlugin,
    ContainerDroppable,
    type CanvasComponentProps
} from '../sdk';
import {
    baseSpacingFields,
    baseSizeFields,
    baseBorderFields,
    baseColorFields,
    baseLayoutFields
} from '../components/canvas-components/properties';

// ============================================================================
// MOCKUP PLAYLIST PLUGIN
// Atomic reconstruction of the "Focus" playlist.
// ============================================================================

// Playlist Container Renderer (Reuses Generic Container logic but pre-wired)
const PlaylistRenderer: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
    // Standard Flex Container
    const {
        display, flexDirection, flexWrap, justifyContent, alignItems, gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        ...visualStyles
    } = commonStyles;

    const layoutStyles = {
        display: display || 'flex',
        flexDirection: flexDirection || 'column',
        flexWrap,
        justifyContent: justifyContent,
        alignItems: alignItems,
        gap,
        paddingTop: paddingTop || 0,
        paddingRight: paddingRight || 0,
        paddingBottom: paddingBottom || 0,
        paddingLeft: paddingLeft || 0,
        width: '100%',
        height: '100%'
    };

    return (
        <div
            className="mockup-theme playlist"
            style={{
                ...visualStyles,
                minHeight: (visualStyles as any).minHeight || 'auto',
                position: 'relative' // For absolute children if needed
            }}
        >
            <ContainerDroppable
                containerId={component.id}
                containerType={component.type}
                children={component.children || []}
                builderContext={builderContext}
                theme={uiTheme}
                canvasTheme={canvasTheme}
                style={layoutStyles as any}
                emptyContent={null}
            />
        </div>
    );
};

export function initMockupPlaylistPlugin() {

    // Theme Variables (Extracted from MockupTheme.css)
    const THEME = {
        bgPrimary: '#0f172a',
        bgSecondary: '#1e293b',
        border: '#475569',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        accent: '#3b82f6',
        radius: 12
    };

    registerPlugin({
        type: 'playlist',
        label: 'Playlist',
        category: 'mockup',
        icon: 'ListMusic',
        description: 'Focus Playlist Template',
        isContainer: true,
        allowedChildren: 'ALL', // Allow anything, but defaults to tracks
        customContainerRenderer: PlaylistRenderer,
        defaultProps: {
            title: 'Focus',
            type: 'playlist',
            // Layout
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            width: '300px', // Default card width
            // Visuals
            backgroundColor: THEME.bgPrimary,
            borderColor: THEME.border,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: THEME.radius,
            padding: { top: '0', right: '0', bottom: '0', left: '0' },
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            ...baseLayoutFields,
            ...baseSpacingFields,
            ...baseSizeFields,
            ...baseBorderFields,
            ...baseColorFields
        ],
        createChildren: () => [
            // 1. Header Container
            {
                type: 'container',
                props: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: { top: '12', right: '16', bottom: '12', left: '16' },
                    backgroundColor: 'transparent', // Let parent bg show, or specific header bg
                    borderBottomWidth: 1,
                    borderBottomColor: THEME.border,
                    borderStyle: 'solid',
                    gap: 0,
                    width: '100%'
                },
                children: [
                    {
                        type: 'text',
                        props: {
                            text: 'Focus',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: THEME.textPrimary,
                            margin: { top: '0', right: '0', bottom: '0', left: '0' }
                        }
                    },
                    {
                        type: 'text',
                        props: {
                            text: 'playlist',
                            fontSize: '12px',
                            color: THEME.textSecondary,
                            margin: { top: '0', right: '0', bottom: '0', left: '0' }
                        }
                    }
                ]
            },
            // 2. Track List Container (Padding wrapper)
            {
                type: 'container',
                props: {
                    flexDirection: 'column',
                    padding: { top: '12', right: '0', bottom: '12', left: '0' },
                    gap: 8,
                    backgroundColor: 'transparent',
                    width: '100%'
                },
                children: [
                    // Track 1
                    {
                        type: 'track', // From mockup-tracks.tsx
                        props: {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            borderLeftWidth: 0, // Reset default track accent
                            padding: { top: '8', right: '16', bottom: '8', left: '16' }, // Match playlist padding
                        },
                        children: [
                            {
                                type: 'icon',
                                props: { icon: 'Music', size: 16, color: THEME.textSecondary }
                            },
                            {
                                type: 'text',
                                props: { text: 'Deep Work', color: THEME.textPrimary, fontSize: '14px', fontWeight: '500', marginLeft: '12px' }
                            },
                            {
                                type: 'spacer',
                                props: { flex: 1 }
                            },
                            {
                                type: 'text', // Duration as simple text for now, or use 'duration' component
                                props: { text: '06:30', color: THEME.textSecondary, fontSize: '12px' }
                            }
                        ]
                    },
                    // Track 2
                    {
                        type: 'track',
                        props: {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            borderLeftWidth: 0,
                            padding: { top: '8', right: '16', bottom: '8', left: '16' },
                        },
                        children: [
                            {
                                type: 'icon',
                                props: { icon: 'Music', size: 16, color: THEME.textSecondary }
                            },
                            {
                                type: 'text',
                                props: { text: 'Flow State', color: THEME.textPrimary, fontSize: '14px', fontWeight: '500', marginLeft: '12px' }
                            },
                            {
                                type: 'spacer',
                                props: { flex: 1 }
                            },
                            {
                                type: 'text',
                                props: { text: '05:15', color: THEME.textSecondary, fontSize: '12px' }
                            }
                        ]
                    }
                ]
            }
        ],
        getHTML: async () => '<div>Playlist</div>'
    });
}
