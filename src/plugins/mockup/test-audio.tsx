import { registerPlugin, type CanvasComponentProps } from '../../sdk';
// Import property definitions
import {
    baseSpacingFields,
    baseSizeFields,
    baseBorderFields
} from '../../components/canvas-components/properties';

import { Music, Play, Headphones, Mic } from 'lucide-react';

// --- RENDERER ---
const TestAudioRenderer: React.FC<CanvasComponentProps> = ({ component, commonStyles }) => {
    const { props } = component;

    // Split styles
    const {
        width, height, marginTop, marginRight, marginBottom, marginLeft,
        ...visualStyles // BG, Border, Radius, Padding, Gap, Color
    } = commonStyles;

    // Restore itemClass definition
    let itemClass = 'flex-item flex-item--track';

    const wrapperStyles = {
        width, height,
        marginTop, marginRight, marginBottom, marginLeft
    };

    // Dynamic Icon
    const getIcon = () => {
        const iconName = props.icon as string;
        if (iconName === 'Play') return <Play size={16} />;
        if (iconName === 'Headphones') return <Headphones size={16} />;
        if (iconName === 'Mic') return <Mic size={16} />;
        return <Music size={16} />; // Default
    };

    return (
        <div className="mockup-theme" style={wrapperStyles}>
            <div className="flex-item-wrapper">
                <div
                    className={itemClass}
                    style={{
                        ...visualStyles
                    }}
                >
                    {/* Icon */}
                    <span className="flex-item-icon" style={{ ...(props.textColor ? { color: props.textColor as string } : { color: visualStyles.color }) }}>{getIcon()}</span>

                    {/* Title */}
                    <span className="flex-item-title" style={{ ...(props.textColor ? { color: props.textColor as string } : { color: visualStyles.color }) }}>{(props.title as any) || 'Audio Track'}</span>

                    {/* Duration */}
                    {!!props.duration && (
                        <span className="flex-item-meta" style={{ ...(props.textColor ? { color: props.textColor as string } : { color: visualStyles.color }) }}>{props.duration as any}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- REGISTRATION ---
export function registerTestAudio() {
    registerPlugin({
        type: 'test-audio', // Specific type requested
        label: 'Test Audio',
        category: 'mockup', // Visible in Mockup category
        icon: 'Music',
        description: 'Audio track with duration',
        render: ({ props, styles }) => <TestAudioRenderer component={{ props } as any} commonStyles={styles} canvasTheme={{} as any} uiTheme={{} as any} builderContext={{} as any} />,
        defaultProps: {
            title: 'New Audio',
            duration: '0:00',
            type: 'audio',
            icon: 'Music',
            backgroundColor: '#0f172a', // var(--mockup-bg-primary)
            padding: { top: '0', right: '0', bottom: '0', left: '0' },
            gap: 0,
            borderRadius: 4,
            // borderColor: '#22c55e', // Removed default
            borderWidth: 0,
            // borderStyle: 'solid',
            color: '#e2e8f0'
        },
        properties: [
            { key: 'title', label: 'Title', type: 'text', group: 'content' },
            { key: 'duration', label: 'Duration', type: 'duration', group: 'settings' },
            {
                key: 'icon',
                label: 'Icon',
                type: 'icon',
                group: 'settings',
                options: [
                    { label: 'Music', value: 'Music' },
                    { label: 'Play', value: 'Play' },
                    { label: 'Headphones', value: 'Headphones' },
                    { label: 'Mic', value: 'Mic' },
                ]
            },
            ...baseSpacingFields,
            ...baseSizeFields,
            ...baseBorderFields,
            { key: 'backgroundColor', label: 'Background', type: 'color', group: 'colors' },
            { key: 'textColor', label: 'Text Color', type: 'color', group: 'colors' },
        ],
        // Simple HTML export for now
        getHTML: async (component) => `
            <div class="audio-track" style="background-color: ${component.props.backgroundColor}">
                <span>♪</span>
                <span class="title">${component.props.title}</span>
                <span class="duration">${component.props.duration}</span>
            </div>
        `
    });
}
