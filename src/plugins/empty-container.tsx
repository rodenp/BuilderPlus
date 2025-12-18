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
// EMPTY CONTAINER PLUGIN
// A minimal container based on "Track" but without header/title.
// ============================================================================

const EmptyContainerRenderer: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
    const {
        display, flexDirection, flexWrap, justifyContent, alignItems, gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        ...visualStyles
    } = commonStyles;

    // Use flex properties from commonStyles or defaults
    const layoutStyles = {
        display: display || 'flex',
        flexDirection: flexDirection || 'column', // Default to column for empty container? Or row? User said based on playlist... let's default to column as it's more generic, or matches playlist (row). Let's stick to standard container defaults.
        flexWrap,
        justifyContent: justifyContent || 'flex-start',
        alignItems: alignItems || 'stretch',
        gap: gap !== undefined ? gap : 16,
        paddingTop: paddingTop !== undefined ? paddingTop : 16,
        paddingRight: paddingRight !== undefined ? paddingRight : 16,
        paddingBottom: paddingBottom !== undefined ? paddingBottom : 16,
        paddingLeft: paddingLeft !== undefined ? paddingLeft : 16,
        width: '100%',
        height: '100%'
    };

    return (
        <div
            className="mockup-theme empty-container"
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
                    <div style={{
                        padding: 10,
                        fontSize: 12,
                        color: '#94a3b8',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        Drop items here
                    </div>
                }
            />
        </div>
    );
};

// --- REGISTRATION ---

export function initEmptyContainerPlugin() {
    registerPlugin({
        type: 'empty-container',
        label: 'Empty Container',
        category: 'mockup',
        icon: 'Square',
        description: 'Flexible container without a header',
        isContainer: true,
        customContainerRenderer: EmptyContainerRenderer,
        render: () => null,
        defaultProps: {
            type: 'empty-container',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 16,
            width: '100%',
            padding: { top: '16', right: '16', bottom: '16', left: '16' },
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            backgroundColor: 'transparent',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#334155',
            borderStyle: 'dashed',
        },
        properties: [
            ...baseLayoutFields,
            ...baseSpacingFields,
            ...baseSizeFields,
            ...baseBorderFields,
            ...baseColorFields
        ],
        createChildren: () => [], // Start empty
        getHTML: async (_component) => `
            <div class="empty-container">
                <!-- Content -->
            </div>
        `
    });
}
