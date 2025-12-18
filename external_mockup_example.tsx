import React from 'react';
import {
    registerPlugin,
    ContainerDroppable,
    extractCommonStyles,
    getComponentHTML,
    type CanvasComponentProps
} from './src/sdk';

// ============================================================================
// EXTERNAL MOCKUP EXAMPLE
// This file demonstrates how to build the "Mockup" features using ONLY the SDK.
// ============================================================================

// --- 1. RENDERERS ---

const SDKMockupItemRenderer: React.FC<CanvasComponentProps> = ({ component, commonStyles }) => {
    const { props } = component;

    // Style logic
    // Classes are kept for potential specific overrides or identification, but styling is property-driven
    let itemClass = 'flex-item';
    if (props.duration || props.icon === 'Music') itemClass += ' flex-item--track';
    else if (props.checked !== undefined) itemClass += ` flex-item--task ${props.checked ? 'flex-item--done' : ''}`;
    else if (props.color) itemClass += ' flex-item--photo';
    else if (props.icon === 'FileText') itemClass += ' flex-item--file';

    // Split styles: Layout vs Visual
    const {
        width, height, marginTop, marginRight, marginBottom, marginLeft,
        ...visualStyles // BG, Border, Radius, Padding, Gap, Color
    } = commonStyles;

    const wrapperStyles = {
        width, height,
        marginTop, marginRight, marginBottom, marginLeft
    };

    return (
        <div className="mockup-theme" style={wrapperStyles}>
            <div className="flex-item-wrapper">
                <div
                    className={itemClass}
                    style={{
                        ...visualStyles,
                        ...(props.color ? { background: props.color as string } : {})
                    }}
                >
                    {props.checked !== undefined && (
                        <span className="flex-item-check">{props.checked ? '✓' : '○'}</span>
                    )}
                    {props.icon === 'Music' && <span className="flex-item-icon">♪</span>}
                    {props.icon === 'FileText' && <span className="flex-item-icon">📄</span>}
                    {props.color && props.emoji && (
                        <span className="flex-item-emoji" style={{ fontSize: '18px' }}>{props.emoji as any}</span>
                    )}

                    {props.title && !props.emoji && (
                        <span className="flex-item-title">{props.title as any}</span>
                    )}
                    {props.text && (
                        <span className="flex-item-title">{props.text as any}</span>
                    )}
                    {props.duration && (
                        <span className="flex-item-meta">{props.duration as any}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const SDKMockupContainerRenderer: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
    const { props } = component;

    // Split styles
    const {
        display, flexDirection, flexWrap, justifyContent, alignItems, gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        ...wrapperStyles
    } = commonStyles;

    const layoutStyles = {
        display: display || 'flex',
        flexDirection: flexDirection || 'column',
        flexWrap,
        justifyContent,
        alignItems,
        gap,
        paddingTop, paddingRight, paddingBottom, paddingLeft
    };

    return (
        <div className="mockup-theme" style={{ height: '100%' }}>
            <div className="flex-container-wrapper" style={{ width: '100%', height: '100%' }}>
                <div className="flex-container" style={wrapperStyles}>
                    <div className="flex-container-header">
                        <span className="flex-container-label">{(props.title as string) || 'Untitled'}</span>
                        {props.type && <span className="flex-container-type">{props.type as string}</span>}
                    </div>

                    <div className="flex-container-content">
                        <ContainerDroppable
                            containerId={component.id}
                            containerType={component.type}
                            children={component.children || []}
                            builderContext={builderContext}
                            theme={uiTheme}
                            canvasTheme={canvasTheme}
                            style={{
                                minHeight: '30px',
                                ...layoutStyles as any
                            }}
                            emptyContent={<div className="flex-container-empty">Drop items here</div>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 2. HTML GENERATION ---

const getSDKHTML = async (component: any): Promise<string> => {
    const { props, children = [] } = component;
    const styles = extractCommonStyles(props);
    const styleString = [
        'display: flex', 'flex-direction: column', 'border: 1px solid #ddd', 'padding: 10px',
        styles.width ? `width: ${styles.width}` : '',
    ].filter(Boolean).join('; ');

    // Recursively get child HTML via SDK helper
    const childHTMLs = await Promise.all(children.map((child: any) => getComponentHTML(child)));

    return `
    <div class="sdk-mockup" style="${styleString}">
      <h3>${props.title || 'External Mockup'}</h3>
      <div class="content">${childHTMLs.join('')}</div>
    </div>`;
};


// --- 3. REGISTRATION ---

export function initExternalMockupApp() {

    // Audio Item
    registerPlugin({
        type: 'audio',
        label: 'Audio',
        category: 'mockup' as any,
        icon: 'Music',
        description: 'Audio item from SDK',
        render: ({ props, styles }) => <SDKMockupItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            title: 'Song',
            duration: '3:00',
            icon: 'Music',
            type: 'audio',
            borderColor: '#22c55e',
            borderWidth: '0px 0px 0px 4px',
            borderStyle: 'solid',
            textColor: '#e2e8f0'
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' },
            { key: 'duration', label: 'Duration', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Audio</div>'
    });

    // Playlist Container
    registerPlugin({
        type: 'playlist',
        label: 'Playlist',
        category: 'mockup' as any,
        icon: 'ListMusic',
        description: 'Playlist from SDK',
        isContainer: true,
        allowedChildren: ['audio'],
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: {
            title: 'Playlist',
            type: 'playlist',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc'
        },
        properties: [
            { key: 'title', label: 'Playlist Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    // Photo Item
    registerPlugin({
        type: 'photo',
        label: 'Photo',
        category: 'mockup' as any,
        icon: 'Image',
        description: 'Photo item from SDK',
        render: ({ props, styles }) => <SDKMockupItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: { color: '#f97316', emoji: '🌅', type: 'photo', borderColor: 'transparent', borderWidth: 0, textColor: '#ffffff' },
        properties: [
            { key: 'emoji', label: 'Emoji', type: 'text', group: 'content' },
            { key: 'color', label: 'Color', type: 'color', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Photo</div>'
    });

    // Album Container
    registerPlugin({
        type: 'album',
        label: 'Album',
        category: 'mockup' as any,
        icon: 'Library',
        description: 'Photo Album from SDK',
        isContainer: true,
        allowedChildren: ['photo', 'album'],
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: { title: 'Vacation', type: 'album', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', textColor: '#f8fafc' },
        properties: [
            { key: 'title', label: 'Album Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    // Task Item
    registerPlugin({
        type: 'task',
        label: 'Task',
        category: 'mockup' as any,
        icon: 'CheckSquare',
        description: 'Task item from SDK',
        render: ({ props, styles }) => <SDKMockupItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: { text: 'New Task', checked: false, type: 'task', borderColor: '#22c55e', borderWidth: '0px 0px 0px 4px', borderStyle: 'solid', textColor: '#e2e8f0' },
        properties: [
            { key: 'text', label: 'Task Name', type: 'text', group: 'content' },
            { key: 'checked', label: 'Done', type: 'boolean', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Task</div>'
    });

    // Task List Container
    registerPlugin({
        type: 'tasklist',
        label: 'Task List',
        category: 'mockup' as any,
        icon: 'ListTodo',
        description: 'Task List from SDK',
        isContainer: true,
        allowedChildren: ['task', 'tasklist'],
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: { title: 'My Tasks', type: 'tasklist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', textColor: '#f8fafc' },
        properties: [
            { key: 'title', label: 'List Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    // Note Item
    registerPlugin({
        type: 'note',
        label: 'Note',
        category: 'mockup' as any,
        icon: 'StickyNote',
        description: 'Note item from SDK',
        render: ({ props, styles }) => <SDKMockupItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: { text: 'Meeting Notes', icon: 'StickyNote', type: 'note', borderColor: '#f59e0b', borderWidth: '0px 0px 0px 4px', borderStyle: 'solid', textColor: '#e2e8f0' },
        properties: [
            { key: 'text', label: 'Note Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Note</div>'
    });

    // File Item
    registerPlugin({
        type: 'file',
        label: 'File',
        category: 'mockup' as any,
        icon: 'File',
        description: 'File item from SDK',
        render: ({ props, styles }) => <SDKMockupItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: { text: 'document.pdf', icon: 'FileText', type: 'file', borderColor: '#f97316', borderWidth: '0px 0px 0px 4px', borderStyle: 'solid', textColor: '#e2e8f0' },
        properties: [
            { key: 'text', label: 'Filename', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>File</div>'
    });

    // Folder Container
    registerPlugin({
        type: 'folder',
        label: 'Folder',
        category: 'mockup' as any,
        icon: 'Folder',
        description: 'Folder from SDK',
        isContainer: true,
        allowedChildren: ['file', 'folder', 'note'],
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: { title: 'New Folder', type: 'folder', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', textColor: '#f8fafc' },
        properties: [
            { key: 'title', label: 'Folder Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    // Workspace Container
    registerPlugin({
        type: 'workspace',
        label: 'Workspace',
        category: 'mockup' as any,
        icon: 'Layout',
        description: 'Workspace from SDK',
        isContainer: true,
        allowedChildren: ['playlist', 'album', 'tasklist', 'folder', 'bucket'],
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: { title: 'My Workspace', type: 'workspace', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', textColor: '#f8fafc' },
        properties: [
            { key: 'title', label: 'Workspace Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    // Bucket
    registerPlugin({
        type: 'bucket',
        label: 'Bucket',
        category: 'mockup' as any,
        icon: 'Box',
        description: 'Generic Bucket from SDK',
        isContainer: true,
        customContainerRenderer: SDKMockupContainerRenderer,
        defaultProps: { title: 'Everything Bucket', type: 'bucket', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', textColor: '#f8fafc' },
        properties: [
            { key: 'title', label: 'Bucket Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getSDKHTML,
        render: () => null
    });

    console.log('External Mockup App Initialized via SDK!');
}
