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
// MOCKUP TRACKS PLUGIN
// Deconstructed "Track" container for building atomic layouts.
// ============================================================================

// 1. Track (Container)
const TrackRenderer: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
    const {
        display, flexDirection, flexWrap, justifyContent, alignItems, gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        ...visualStyles
    } = commonStyles;

    // Defaults for a Track are Flex Row, Center Align
    const layoutStyles = {
        display: display || 'flex',
        flexDirection: flexDirection || 'row',
        flexWrap,
        justifyContent: justifyContent || 'flex-start',
        alignItems: alignItems || 'center',
        gap: gap !== undefined ? gap : 12, // Default gap for track items
        paddingTop: paddingTop !== undefined ? paddingTop : 8,
        paddingRight: paddingRight !== undefined ? paddingRight : 12,
        paddingBottom: paddingBottom !== undefined ? paddingBottom : 8,
        paddingLeft: paddingLeft !== undefined ? paddingLeft : 12,
        width: '100%',
        height: '100%'
    };

    return (
        <div
            className="mockup-theme track"
            style={{
                ...visualStyles,
                minHeight: (visualStyles as any).minHeight || 'auto',
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
                emptyContent={
                    <div style={{ padding: 10, fontSize: 11, color: '#64748b', border: '1px dashed #475569', borderRadius: 4 }}>
                        Empty Track
                    </div>
                }
            />
        </div>
    );
};

// --- REGISTRATION ---

export function initMockupTracksPlugin() {
    // 1. Track (Container)
    registerPlugin({
        type: 'track',
        label: 'Track',
        category: 'mockup', // Group with other mockup items
        icon: 'Music',
        description: 'Audio Track Container',
        isContainer: true,
        // We rely on core 'text' and 'icon' components being available in the builder
        allowedChildren: ['text', 'icon', 'image', 'spacer'],
        customContainerRenderer: TrackRenderer,
        render: () => null, // Dummy render, unused because customContainerRenderer takes precedence
        defaultProps: {
            title: 'Track',
            type: 'track',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            // Padding defaults to match typical list item
            padding: { top: '8', right: '12', bottom: '8', left: '12' },
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            backgroundColor: '#050000',
            borderRadius: 4,
            borderWidth: 0,
            borderLeftWidth: 4,
            borderColor: '#22c55e',
            borderStyle: 'solid',
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
            {
                type: 'icon',
                props: { icon: 'Music', size: 24, color: '#22c55e' } // Green accent
            },
            {
                type: 'text',
                props: { text: 'Track Name', color: '#d1e52c', fontSize: '13px', fontWeight: '500' }
            },
            {
                type: 'spacer',
                props: { flex: 1 } // Push duration to the right
            },
            {
                type: 'duration',
                props: { duration: '03:45', color: '#e80f0f', showIcon: false }
            }
        ],
        getHTML: async () => '<div>Track</div>'
    });
}
