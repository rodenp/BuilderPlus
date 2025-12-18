import React from 'react';
import {
    registerPlugin,
    ContainerDroppable,
    extractCommonStyles,
    getComponentHTML,
    type CanvasComponentProps
} from './sdk';
// Unused icons removed

// ============================================================================
// TESTING MOCKUP PLUGIN
// Restoring original "Internal" Mockup components for Drag & Drop testing.
// Category: "Testing Mockup"
// ============================================================================

// --- RENDERERS ---

const TestItemRenderer: React.FC<CanvasComponentProps> = ({ component, commonStyles }) => {
    const { props } = component;

    // Mimic the original class logic (ID only)
    let itemClass = 'flex-item';
    if (props.duration || props.icon === 'Music') itemClass += ' flex-item--track';
    else if (props.checked !== undefined) itemClass += ` flex-item--task ${props.checked ? 'flex-item--done' : ''}`;
    else if (props.color) itemClass += ' flex-item--photo';
    else if (props.icon === 'FileText') itemClass += ' flex-item--file';

    // Split styles
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
                    {!!props.color && !!props.emoji && (
                        <span className="flex-item-emoji" style={{ fontSize: '18px' }}>{props.emoji as any}</span>
                    )}

                    {!!props.title && !props.emoji && (
                        <span className="flex-item-title">{props.title as any}</span>
                    )}
                    {!!props.text && (
                        <span className="flex-item-title">{props.text as any}</span>
                    )}
                    {!!props.duration && (
                        <span className="flex-item-meta">{props.duration as any}</span>
                    )}
                    {/* Fallback for generic items */}
                    {!props.title && !props.text && !props.duration && (
                        <span className="flex-item-title">Item</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const TestContainerRenderer: React.FC<CanvasComponentProps> = ({ component, builderContext, canvasTheme, uiTheme, commonStyles }) => {
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
                <div className="flex-container" data-type={props.type as string} style={wrapperStyles}>
                    <div className="flex-container-header">
                        <span className="flex-container-label">{(props.title as string) || 'Container'}</span>
                        {!!props.type && <span className="flex-container-type">{props.type as any}</span>}
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

// --- HTML ---
const getTestHTML = async (component: any): Promise<string> => {
    const { props, children = [] } = component;
    const styles = extractCommonStyles(props);
    const styleString = [
        'display: flex', 'flex-direction: column',
        styles.width ? `width: ${styles.width}` : '',
    ].filter(Boolean).join('; ');

    const childHTMLs = await Promise.all(children.map((child: any) => getComponentHTML(child)));

    return `
    <div class="test-mockup" style="${styleString}">
      <h3>${props.title || 'Testing Container'}</h3>
      <div class="content">${childHTMLs.join('')}</div>
    </div>`;
};

// --- REGISTRATION ---

export function initTestingMockupPlugin() {

    const category = 'testing-mockup';
    const hidden = 'hidden-from-sidebar'; // Use a category that isn't in definitions to hide
    registerTemplateComponents(hidden);

    // 1. Generic Mockup Item
    registerPlugin({
        type: 'test-generic-item',
        label: 'Generic Item',
        category: hidden as any,
        icon: 'Layout',
        description: 'Generic item for testing',
        render: ({ props, styles }) => <TestItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: { text: 'Generic Item', type: 'item' },
        properties: [
            { key: 'text', label: 'Label', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Generic Item</div>'
    });

    // 2. Generic Mockup Container
    registerPlugin({
        type: 'test-generic-container',
        label: 'Generic Column',
        category: hidden as any,
        icon: 'GalleryVertical',
        description: 'Generic container for testing',
        isContainer: true,
        allowedChildren: 'ALL',
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Generic Column', type: 'container' },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 3. Audio (Test version)
    registerPlugin({
        type: 'test-audio',
        label: 'Test Audio',
        category: hidden as any,
        icon: 'Music',
        description: 'Audio item',
        render: ({ props, styles }) => <TestItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            title: 'Playlist',
            type: 'test-playlist',
            borderColor: '#22c55e',
            borderWidth: '0px 0px 0px 4px',
            borderStyle: 'solid',
            textColor: '#e2e8f0',
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Audio</div>'
    });

    // 4. Playlist (Test version)
    registerPlugin({
        type: 'test-playlist',
        label: 'Test Playlist',
        category: hidden as any,
        icon: 'ListMusic',
        description: 'Audio Container',
        isContainer: true,
        allowedChildren: ['test-audio'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'Playlist',
            type: 'playlist',
            borderColor: '#3b82f6',
            borderWidth: 4,
            borderStyle: 'solid',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 5. Task (Test version)
    registerPlugin({
        type: 'test-task',
        label: 'Test Task',
        category: category as any,
        icon: 'CheckSquare',
        description: 'Task item',
        render: ({ props, styles }) => <TestItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            text: 'New Task',
            checked: false,
            type: 'test-task',
            borderColor: '#22c55e',
            borderWidth: '0px 0px 0px 4px',
            borderStyle: 'solid',
            textColor: '#e2e8f0',
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'text', label: 'Task', type: 'text', group: 'content' },
            { key: 'checked', label: 'Done', type: 'boolean', group: 'content' }
        ],
        getHTML: async () => '<div>Task</div>'
    });

    // 6. TaskList (Test version)
    registerPlugin({
        type: 'test-tasklist',
        label: 'Test Task List',
        category: hidden as any,
        icon: 'ListTodo',
        description: 'Task Container',
        isContainer: true,
        allowedChildren: ['test-task', 'test-tasklist'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'My Tasks',
            type: 'test-tasklist',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 7. Bucket (Test version - Everything)
    registerPlugin({
        type: 'test-bucket',
        label: 'Test Bucket',
        category: hidden as any,
        icon: 'Box',
        description: 'Anything Container',
        isContainer: true,
        allowedChildren: 'ALL',
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Bucket', type: 'bucket', borderColor: '#a855f7', borderWidth: 4, borderStyle: 'solid' },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 8. File (Test version)
    registerPlugin({
        type: 'test-file',
        label: 'Test File',
        category: category as any,
        icon: 'File',
        description: 'File item',
        render: ({ props, styles }) => <TestItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            text: 'document.pdf',
            icon: 'FileText',
            type: 'test-file',

            textColor: '#e2e8f0',
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'text', label: 'Filename', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>File</div>'
    });

    // 9. Folder (Test version - Recursive)
    registerPlugin({
        type: 'test-folder',
        label: 'Test Folder',
        category: hidden as any,
        icon: 'Folder',
        description: 'Folder Container',
        isContainer: true,
        allowedChildren: ['test-file', 'test-folder'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'New Folder',
            type: 'test-folder',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Folder Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 10. Photo (Test version)
    registerPlugin({
        type: 'test-photo',
        label: 'Test Photo',
        category: hidden as any,
        icon: 'Image',
        description: 'Photo item',
        render: ({ props, styles }) => <TestItemRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            color: '#f97316',
            emoji: '🌅',
            type: 'test-photo',
            borderColor: 'transparent',
            borderWidth: 0,
            textColor: '#ffffff',
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'emoji', label: 'Emoji', type: 'text', group: 'content' },
            { key: 'color', label: 'Color', type: 'color', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: async () => '<div>Photo</div>'
    });

    // 11. Album (Test version - Recursive)
    registerPlugin({
        type: 'test-album',
        label: 'Test Album',
        category: hidden as any,
        icon: 'Library',
        description: 'Album Container',
        isContainer: true,
        allowedChildren: ['test-photo', 'test-album'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'Vacation',
            type: 'test-album',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Album Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // 12. Workspace (Test version - Containers only)
    registerPlugin({
        type: 'test-workspace',
        label: 'Test Workspace',
        category: hidden as any,
        icon: 'Layout',
        description: 'Workspace Container',
        isContainer: true,
        allowedChildren: ['test-playlist', 'test-album', 'test-tasklist', 'test-folder', 'test-bucket', 'test-tpl-morning', 'test-tpl-focus', 'test-tpl-vacation', 'test-tpl-sprint', 'test-tpl-docs'], // Allow templates too
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'Test Workspace',
            type: 'test-workspace',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        properties: [
            { key: 'title', label: 'Workspace Name', type: 'text', group: 'content' },
            { key: 'type', label: 'Type', type: 'text', group: 'content' }
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // --- TEMPLATES (Pre-populated trees) ---

    // Template 1: Music & Media
    registerPlugin({
        type: 'test-template-media',
        label: 'Music & Media',
        category: category as any,
        icon: 'Library',
        description: 'Full Media Workspace',
        render: ({ props, styles }) => <TestContainerRenderer component={{ ...props, type: 'test-workspace' } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        isContainer: true,
        allowedChildren: ['test-playlist', 'test-album'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Music & Media', type: 'test-workspace', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        createChildren: () => [
            {
                type: 'test-tpl-morning',
                props: { title: 'Morning Mix', type: 'playlist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
                children: [
                    { type: 'test-audio', props: { title: 'Sunrise', duration: '3:24', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
                    { type: 'test-audio', props: { title: 'Coffee Jazz', duration: '4:12', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
                    { type: 'test-audio', props: { title: 'Wake Up', duration: '2:58', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
                ]
            },
            {
                type: 'test-tpl-focus',
                props: { title: 'Focus', type: 'playlist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
                children: [
                    { type: 'test-audio', props: { title: 'Deep Work', duration: '6:30', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
                    { type: 'test-audio', props: { title: 'Flow State', duration: '5:15', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
                ]
            },
            {
                type: 'test-tpl-vacation',
                props: { title: 'Vacation', type: 'album', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid' },
                children: [
                    { type: 'test-photo', props: { title: 'Beach', emoji: '🏖️', color: '#06b6d4', borderColor: 'transparent', borderWidth: 0 } },
                    { type: 'test-photo', props: { title: 'Waves', emoji: '🌊', color: '#3b82f6', borderColor: 'transparent', borderWidth: 0 } },
                    { type: 'test-photo', props: { title: 'Sunset', emoji: '🌅', color: '#f97316', borderColor: 'transparent', borderWidth: 0 } },
                ]
            },
        ],
        getHTML: getTestHTML,
    });

    // 2. Projects
    registerPlugin({
        type: 'test-template-projects',
        label: 'Projects',
        category: category as any,
        icon: 'Layout',
        description: 'Full Project Structure',
        isContainer: true,
        allowedChildren: ['test-tasklist'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Projects', type: 'test-workspace', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        createChildren: () => [
            {
                type: 'test-tpl-sprint',
                props: { title: 'Sprint 1', type: 'tasklist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
                children: [
                    { type: 'test-task', props: { text: 'Build UI', checked: true, borderWidth: 0, color: '#e2e8f0' } },
                    { type: 'test-task', props: { text: 'Add animations', checked: false, borderWidth: 0, color: '#e2e8f0' } },
                ]
            },
            {
                type: 'test-tpl-sprint',
                props: { title: 'Backlog', type: 'tasklist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
                children: [
                    { type: 'test-task', props: { text: 'Performance Check', checked: false, borderWidth: 0, color: '#e2e8f0' } },
                ]
            },
        ],
        getHTML: getTestHTML,
        render: ({ props, styles }) => <TestContainerRenderer component={{ ...props, type: 'test-workspace' } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
    });

    // 3. Files
    registerPlugin({
        type: 'test-template-files',
        label: 'Files',
        category: category as any,
        icon: 'Folder',
        description: 'Full File Structure',
        isContainer: true,
        allowedChildren: ['test-folder'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Files', type: 'test-workspace', borderColor: '#a855f7', borderWidth: 4, borderStyle: 'solid' },
        createChildren: () => [
            {
                type: 'test-tpl-docs',
                props: { title: 'Documents', type: 'folder' },
                children: [
                    { type: 'test-file', props: { text: 'report.pdf', icon: 'FileText' } },
                    { type: 'test-file', props: { text: 'notes.txt', icon: 'FileText' } },
                ]
            },
            {
                type: 'test-folder',
                props: { title: 'Work', type: 'folder', borderColor: '#3b82f6', borderWidth: 4, borderStyle: 'solid' },
                // Folders are recursive, but here we just make a simple one
                children: [
                    { type: 'test-file', props: { text: 'invoice.pdf', icon: 'FileText' } }
                ]
            },
        ],
        getHTML: getTestHTML,
        render: ({ props, styles }) => <TestContainerRenderer component={{ ...props, type: 'test-workspace' } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
    });

    // 4. Everything Bucket
    registerPlugin({
        type: 'test-template-bucket',
        label: 'Everything Bucket',
        category: category as any,
        icon: 'Box',
        description: 'Full Bucket',
        isContainer: true,
        allowedChildren: 'ALL',
        customContainerRenderer: TestContainerRenderer,
        defaultProps: {
            title: 'Everything Bucket',
            type: 'test-bucket',
            borderColor: '#475569',
            borderWidth: 1,
            borderStyle: 'solid',
            textColor: '#f8fafc',
            gap: 0,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            padding: { top: '0', right: '0', bottom: '0', left: '0' }
        },
        createChildren: () => [
            { type: 'test-audio', props: { title: 'Random Song', duration: '3:00', icon: 'Music', borderWidth: 0, color: '#e2e8f0' } },
            { type: 'test-task', props: { text: 'Random Task', checked: false, borderWidth: 0, color: '#e2e8f0' } },
        ],
        getHTML: getTestHTML,
        render: ({ props, styles }) => <TestContainerRenderer component={{ ...props, type: 'test-bucket' } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
    });
}

// Helper to register populated sub-components
function registerTemplateComponents(category: string) {

    // --- SUB-COMPONENTS (Level 2) ---

    // Morning Mix (Playlist + Audio)
    registerPlugin({
        type: 'test-tpl-morning', // Internal type
        label: 'Morning Mix',
        category: category as any,
        icon: 'ListMusic',
        description: '',
        isContainer: true,
        allowedChildren: ['test-audio'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Morning Mix', type: 'playlist' }, // Render as playlist
        createChildren: () => [
            { type: 'test-audio', props: { title: 'Sunrise', duration: '3:24', icon: 'Music' } },
            { type: 'test-audio', props: { title: 'Coffee Jazz', duration: '4:12', icon: 'Music' } },
            { type: 'test-audio', props: { title: 'Wake Up', duration: '2:58', icon: 'Music' } },
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // Focus (Playlist + Audio)
    registerPlugin({
        type: 'test-tpl-focus',
        label: 'Focus Mix',
        category: category as any,
        icon: 'ListMusic',
        description: '',
        isContainer: true,
        allowedChildren: ['test-audio'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Focus', type: 'playlist' },
        createChildren: () => [
            { type: 'test-audio', props: { title: 'Deep Work', duration: '6:30', icon: 'Music' } },
            { type: 'test-audio', props: { title: 'Flow State', duration: '5:15', icon: 'Music' } },
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // Vacation (Album + Photos)
    registerPlugin({
        type: 'test-tpl-vacation',
        label: 'Vacation Album',
        category: category as any,
        icon: 'Library',
        description: '',
        isContainer: true,
        allowedChildren: ['test-photo'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Vacation', type: 'album' },
        createChildren: () => [
            { type: 'test-photo', props: { title: 'Beach', emoji: '🏖️', color: '#06b6d4' } },
            { type: 'test-photo', props: { title: 'Waves', emoji: '🌊', color: '#3b82f6' } },
            { type: 'test-photo', props: { title: 'Sunset', emoji: '🌅', color: '#f97316' } },
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // Sprint 1 (TaskList + Tasks)
    registerPlugin({
        type: 'test-tpl-sprint',
        label: 'Sprint 1',
        category: category as any,
        icon: 'ListTodo',
        description: '',
        isContainer: true,
        allowedChildren: ['test-task'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Sprint 1', type: 'tasklist' },
        createChildren: () => [
            { type: 'test-task', props: { text: 'Build UI', checked: true } },
            { type: 'test-task', props: { text: 'Add animations', checked: false } },
        ],
        getHTML: getTestHTML,
        render: () => null
    });

    // Documents (Folder + Files)
    registerPlugin({
        type: 'test-tpl-docs',
        label: 'Documents',
        category: category as any,
        icon: 'Folder',
        description: '',
        isContainer: true,
        allowedChildren: ['test-file', 'test-folder'],
        customContainerRenderer: TestContainerRenderer,
        defaultProps: { title: 'Documents', type: 'folder' },
        createChildren: () => [
            { type: 'test-file', props: { text: 'report.pdf', icon: 'FileText' } },
            { type: 'test-file', props: { text: 'notes.txt', icon: 'FileText' } },
        ],
        getHTML: getTestHTML,
        render: () => null
    });
}
