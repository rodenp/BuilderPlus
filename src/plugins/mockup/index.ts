import React from 'react';
import { registerPlugin } from '../../framework/plugin-api';
import { Renderer as MockupContainerRenderer } from './container/Renderer';
import { Renderer as MockupItemRenderer } from './item/Renderer';
import { getHTML as getMockupContainerHTML } from './container/getHTML';
import { getHTML as getMockupItemHTML } from './item/getHTML';
import { properties as containerProperties, defaultProps as containerDefaults } from './container/properties';
import { properties as itemProperties, defaultProps as itemDefaults } from './item/properties';

/**
 * MOCKUP EXTENSION PLUGIN
 * 
 * Defines the mockup ecosystem with strict parenting rules.
 */
export function registerMockupPlugin() {

    // --- ITEMS ---

    const itemTypes = [
        { type: 'audio', label: 'Audio', icon: 'Music', defaultProps: { type: 'audio', duration: '3:00', borderWidth: 0, color: '#e2e8f0' } },
        { type: 'task', label: 'Task', icon: 'CheckSquare', defaultProps: { type: 'task', checked: false, borderWidth: 0, color: '#e2e8f0' } },
        { type: 'file', label: 'File', icon: 'File', defaultProps: { type: 'file', icon: 'FileText', borderColor: '#f97316', borderWidth: '0px 0px 0px 4px', borderStyle: 'solid', color: '#e2e8f0' } },
        { type: 'photo', label: 'Photo', icon: 'Image', defaultProps: { type: 'photo', emoji: '🌅', backgroundColor: '#f97316', borderColor: 'transparent', borderWidth: 0, color: '#ffffff' } },
        { type: 'note', label: 'Note', icon: 'StickyNote', defaultProps: { type: 'note', icon: 'StickyNote', borderColor: '#f59e0b', borderWidth: '0px 0px 0px 4px', borderStyle: 'solid', color: '#e2e8f0' } },
    ];

    itemTypes.forEach(({ type, label, icon, defaultProps }) => {
        registerPlugin({
            type,
            label,
            category: 'mockup',
            icon,
            description: `A ${label} item`,
            render: ({ props, styles }) => React.createElement(MockupItemRenderer, {
                component: { id: 'preview', type, props: { ...props, type }, children: [] } as any,
                canvasTheme: { bg: '', text: '', link: '' },
                commonStyles: styles,
                uiTheme: {} as any
            }),
            defaultProps: { ...itemDefaults, ...defaultProps },
            properties: itemProperties,
            getHTML: getMockupItemHTML,
        });
    });


    // --- CONTAINERS ---

    // 1. Playlist (Audio only)
    registerPlugin({
        type: 'playlist',
        label: 'Playlist',
        category: 'mockup',
        icon: 'ListMusic',
        description: 'Collection of audio tracks',
        isContainer: true,
        allowedChildren: ['audio'],
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Playlist', type: 'playlist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });

    // 2. Album (Photos + Nested Albums)
    registerPlugin({
        type: 'album',
        label: 'Album',
        category: 'mockup',
        icon: 'Library',
        description: 'Collection of photos',
        isContainer: true,
        allowedChildren: ['photo', 'album'],
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Album', type: 'album', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });

    // 3. Tasklist (Tasks + Nested Tasklists)
    registerPlugin({
        type: 'tasklist',
        label: 'Task List',
        category: 'mockup',
        icon: 'ListTodo',
        description: 'List of tasks',
        isContainer: true,
        allowedChildren: ['task', 'tasklist'],
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Tasks', type: 'tasklist', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });

    // 4. Folder (Files, Folders, Notes)
    registerPlugin({
        type: 'folder',
        label: 'Folder',
        category: 'mockup',
        icon: 'Folder',
        description: 'File folder',
        isContainer: true,
        allowedChildren: ['file', 'folder', 'note'],
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Folder', type: 'folder', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });

    // 5. Workspace (Containers only)
    registerPlugin({
        type: 'workspace',
        label: 'Workspace',
        category: 'mockup',
        icon: 'Layout',
        description: 'Mockup Workspace',
        isContainer: true,
        // allowedChildren: ['playlist', 'album', 'tasklist', 'folder', 'bucket'], // Relaxed to allow testing
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Workspace', type: 'workspace', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });

    // 6. Bucket (Everything)
    registerPlugin({
        type: 'bucket',
        label: 'Bucket',
        category: 'mockup',
        icon: 'Box',
        description: 'Stores anything',
        isContainer: true,
        customContainerRenderer: MockupContainerRenderer,
        defaultProps: { ...containerDefaults, title: 'Bucket', type: 'bucket', borderColor: '#475569', borderWidth: 1, borderStyle: 'solid', color: '#f8fafc' },
        properties: containerProperties,
        getHTML: getMockupContainerHTML,
        render: () => null,
    });
}
