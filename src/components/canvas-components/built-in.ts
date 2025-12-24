/**
 * Registration of all built-in components
 *
 * This file registers all the default components that come with the page builder.
 * It uses the same registerComponent API that external consumers use.
 */

import React from 'react';
import { registerComponent } from './register';

// Import all built-in component renderers and properties
import * as button from './button';
import * as heading from './heading';
import * as paragraph from './paragraph';
import * as text from './text';
import * as image from './image';
import * as video from './video';
import * as link from './link';
import * as divider from './divider';
import * as spacer from './spacer';
import * as container from './container';
import * as columns from './columns';
import * as card from './card';
import * as section from './section';
import * as list from './list';
import * as quote from './quote';
import * as icon from './icon';
import * as input from './input';
import * as textarea from './textarea';
import * as checkbox from './checkbox';
import * as radio from './radio';
import * as select from './select';
import * as form from './form';
import * as menu from './menu';
import * as breadcrumb from './breadcrumb';
import * as time from './time';
import * as date from './date';
import * as duration from './duration';

// Helper to create a render function that adapts our internal Renderer to the public API
function createRenderFunction(InternalRenderer: React.FC<any>) {
    // Return a simple function that creates the renderer props
    return ({ props, theme, styles, isPreviewMode, renderChild, children, builderContext }: any) => {
        const canvasTheme = {
            bg: theme.background,
            text: theme.text,
            link: theme.link,
        };

        const component = {
            id: props._internalId || 'unknown',
            type: props._internalType || 'unknown',
            props,
            children: children?.map((c: any) => ({ ...c, props: c.props || {} })),
        };

        return React.createElement(InternalRenderer, {
            component,
            canvasTheme,
            uiTheme: {} as any,
            commonStyles: styles,
            isPreviewMode,
            renderChild,
            builderContext,
        });
    };
}

/**
 * Register all built-in components
 * This should be called once when the application initializes
 */
export function registerBuiltInComponents(): void {
    // Basic components
    registerComponent({
        type: 'button',
        label: 'Button',
        category: 'basic',
        icon: 'MousePointerClick',
        description: 'Clickable button',
        render: createRenderFunction(button.Renderer),
        defaultProps: button.defaultProps,
        styleProperties: button.styleProperties,
        getHTML: button.getHTML,
    });

    registerComponent({
        type: 'divider',
        label: 'Divider',
        category: 'basic',
        icon: 'Minus',
        description: 'Horizontal divider line',
        render: createRenderFunction(divider.Renderer),
        defaultProps: divider.defaultProps,
        styleProperties: divider.styleProperties,
        getHTML: divider.getHTML,
    });

    registerComponent({
        type: 'spacer',
        label: 'Spacer',
        category: 'basic',
        icon: 'MoveVertical',
        description: 'Empty space',
        render: createRenderFunction(spacer.Renderer),
        defaultProps: spacer.defaultProps,
        styleProperties: spacer.styleProperties,
        getHTML: spacer.getHTML,
    });

    // Typography components
    registerComponent({
        type: 'heading',
        label: 'Heading',
        category: 'typography',
        icon: 'Heading',
        description: 'Section heading',
        render: createRenderFunction(heading.Renderer),
        defaultProps: heading.defaultProps,
        styleProperties: heading.styleProperties,
        getHTML: heading.getHTML,
    });

    registerComponent({
        type: 'paragraph',
        label: 'Paragraph',
        category: 'typography',
        icon: 'AlignLeft',
        description: 'Body text',
        render: createRenderFunction(paragraph.Renderer),
        defaultProps: paragraph.defaultProps,
        styleProperties: paragraph.styleProperties,
        getHTML: paragraph.getHTML,
    });

    registerComponent({
        type: 'text',
        label: 'Text',
        category: 'typography',
        icon: 'Type',
        description: 'Inline text',
        render: createRenderFunction(text.Renderer),
        defaultProps: text.defaultProps,
        styleProperties: text.styleProperties,
        getHTML: text.getHTML,
    });

    registerComponent({
        type: 'list',
        label: 'List',
        category: 'typography',
        icon: 'List',
        description: 'Bulleted or numbered list',
        render: createRenderFunction(list.Renderer),
        defaultProps: list.defaultProps,
        styleProperties: list.styleProperties,
        isContainer: true,
        allowedChildren: ['text', 'paragraph', 'link', 'icon', 'image', 'button'],
        createChildren: () => [
            { type: 'text', props: { text: 'Item 1' } },
            { type: 'text', props: { text: 'Item 2' } },
            { type: 'text', props: { text: 'Item 3' } },
        ],
        getHTML: list.getHTML,
    });

    registerComponent({
        type: 'quote',
        label: 'Quote',
        category: 'typography',
        icon: 'Quote',
        description: 'Block quote',
        render: createRenderFunction(quote.Renderer),
        defaultProps: quote.defaultProps,
        styleProperties: quote.styleProperties,
        getHTML: quote.getHTML,
    });

    // Media components
    registerComponent({
        type: 'image',
        label: 'Image',
        category: 'media',
        icon: 'Image',
        description: 'Image with URL',
        render: createRenderFunction(image.Renderer),
        defaultProps: image.defaultProps,
        styleProperties: image.styleProperties,
        getHTML: image.getHTML,
    });

    registerComponent({
        type: 'video',
        label: 'Video',
        category: 'media',
        icon: 'Video',
        description: 'Video player',
        render: createRenderFunction(video.Renderer),
        defaultProps: video.defaultProps,
        styleProperties: video.styleProperties,
        getHTML: video.getHTML,
    });

    registerComponent({
        type: 'icon',
        label: 'Icon',
        category: 'media',
        icon: 'Smile',
        description: 'Icon element',
        render: createRenderFunction(icon.Renderer),
        defaultProps: icon.defaultProps,
        properties: icon.contentFields,
        getHTML: icon.getHTML,
    });

    // Layout components
    registerComponent({
        type: 'container',
        label: 'Container',
        category: 'layout',
        icon: 'Square',
        description: 'Container box',
        isContainer: true,
        render: createRenderFunction(container.Renderer),
        defaultProps: container.defaultProps,
        styleProperties: container.styleProperties,
        getHTML: container.getHTML,
    });

    registerComponent({
        type: 'columns',
        label: 'Columns',
        category: 'layout',
        icon: 'Columns',
        description: 'Column layout',
        isContainer: true,
        allowedChildren: ['container'],
        render: createRenderFunction(columns.Renderer),
        defaultProps: columns.defaultProps,
        styleProperties: columns.styleProperties,
        getHTML: columns.getHTML,
    });

    registerComponent({
        type: 'card',
        label: 'Card',
        category: 'layout',
        icon: 'CreditCard',
        description: 'Card container',
        isContainer: true,
        render: createRenderFunction(card.Renderer),
        defaultProps: card.defaultProps,
        styleProperties: card.styleProperties,
        getHTML: card.getHTML,
    });

    registerComponent({
        type: 'section',
        label: 'Section',
        category: 'layout',
        icon: 'LayoutTemplate',
        description: 'Page section',
        isContainer: true,
        render: createRenderFunction(section.Renderer),
        defaultProps: section.defaultProps,
        styleProperties: section.styleProperties,
        getHTML: section.getHTML,
    });

    // Form components
    registerComponent({
        type: 'input',
        label: 'Input',
        category: 'forms',
        icon: 'TextCursor',
        description: 'Text input field',
        render: createRenderFunction(input.Renderer),
        defaultProps: input.defaultProps,
        getHTML: input.getHTML,
    });

    registerComponent({
        type: 'textarea',
        label: 'Textarea',
        category: 'forms',
        icon: 'FileText',
        description: 'Multi-line text input',
        render: createRenderFunction(textarea.Renderer),
        defaultProps: textarea.defaultProps,
        getHTML: textarea.getHTML,
    });

    registerComponent({
        type: 'checkbox',
        label: 'Checkbox',
        category: 'forms',
        icon: 'CheckSquare',
        description: 'Checkbox input',
        render: createRenderFunction(checkbox.Renderer),
        defaultProps: checkbox.defaultProps,
        getHTML: checkbox.getHTML,
    });

    registerComponent({
        type: 'radio',
        label: 'Radio',
        category: 'forms',
        icon: 'Circle',
        description: 'Radio button',
        render: createRenderFunction(radio.Renderer),
        defaultProps: radio.defaultProps,
        getHTML: radio.getHTML,
    });

    registerComponent({
        type: 'select',
        label: 'Select',
        category: 'forms',
        icon: 'ChevronDown',
        description: 'Dropdown select',
        render: createRenderFunction(select.Renderer),
        defaultProps: select.defaultProps,
        getHTML: select.getHTML,
    });

    registerComponent({
        type: 'form',
        label: 'Form',
        category: 'forms',
        icon: 'ClipboardList',
        description: 'Form container',
        isContainer: true,
        allowedChildren: ['input', 'textarea', 'checkbox', 'radio', 'select', 'button', 'divider', 'spacer', 'heading', 'paragraph', 'text'],
        render: createRenderFunction(form.Renderer),
        defaultProps: form.defaultProps,
        styleProperties: form.styleProperties,
        getHTML: form.getHTML,
    });

    // Navigation components
    registerComponent({
        type: 'link',
        label: 'Link',
        category: 'navigation',
        icon: 'Link',
        description: 'Hyperlink',
        render: createRenderFunction(link.Renderer),
        defaultProps: link.defaultProps,
        styleProperties: link.styleProperties,
        getHTML: link.getHTML,
    });

    registerComponent({
        type: 'menu',
        label: 'Menu',
        category: 'navigation',
        icon: 'Menu',
        description: 'Navigation menu',
        render: createRenderFunction(menu.Renderer),
        defaultProps: menu.defaultProps,
        getHTML: menu.getHTML,
        createChildren: () => [
            { type: 'link', props: { text: 'Home', href: '#' } },
            { type: 'link', props: { text: 'About', href: '#' } },
            { type: 'link', props: { text: 'Contact', href: '#' } },
        ],
    });

    registerComponent({
        type: 'breadcrumb',
        label: 'Breadcrumb',
        category: 'navigation',
        icon: 'ChevronRight',
        description: 'Breadcrumb navigation',
        render: createRenderFunction(breadcrumb.Renderer),
        defaultProps: breadcrumb.defaultProps,
        getHTML: breadcrumb.getHTML,
    });

    // Mockup Components
    registerComponent({
        type: 'time',
        label: 'Time',
        category: 'typography',
        icon: 'Clock',
        description: 'Time display',
        render: createRenderFunction(time.Renderer),
        defaultProps: time.defaultProps,
        properties: time.contentFields,
    });

    registerComponent({
        type: 'date',
        label: 'Date',
        category: 'typography',
        icon: 'Calendar',
        description: 'Date display',
        render: createRenderFunction(date.Renderer),
        defaultProps: date.defaultProps,
        properties: date.contentFields,
    });

    registerComponent({
        type: 'duration',
        label: 'Duration',
        category: 'typography',
        icon: 'Timer',
        description: 'Duration display',
        render: createRenderFunction(duration.Renderer),
        defaultProps: duration.defaultProps,
        properties: duration.contentFields,
    });
}
