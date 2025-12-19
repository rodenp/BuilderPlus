import React, { useState, useRef, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { Theme as UITheme } from '../panels/property-panel/theme';
import type { BodySettings } from '../../types/bodySettings';
import type { CanvasComponent } from '../../types/component-types';
import { CanvasComponentRenderer } from './CanvasComponentRenderer';
import { SelectionOverlay } from './SelectionOverlay';
import { DragTypes } from '../../types/dnd-types';
import { globalThemeRegistry } from '../../core/theme-registry';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface CanvasProps {
    onCanvasThemeChange?: (themeId: string) => void;
    theme: UITheme;
    bodySettings: BodySettings;
    components: CanvasComponent[];
    onComponentsChange?: (components: CanvasComponent[]) => void;
    selectedComponentId?: string | null;
    onSelectComponent?: (id: string | null) => void;
    previewMode?: boolean;
    builderContext: any; // Type strictly later
}

export const Canvas: React.FC<CanvasProps> = (props) => {
    const {
        onCanvasThemeChange,
        theme,
        bodySettings,
        components,
        onSelectComponent,
        builderContext
    } = props;
    const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
    const ref = useRef<HTMLDivElement>(null);

    const getCanvasWidth = () => {
        switch (deviceType) {
            case 'mobile':
                return '375px';
            case 'tablet':
                return '768px';
            case 'desktop':
            default:
                return '100%';
        }
    };

    // Resolve the active theme from registry or custom themes
    const activeThemeObject = useMemo(() => {
        const systemTheme = globalThemeRegistry.getTheme(bodySettings.activeCanvasThemeId);
        let baseTheme = systemTheme;

        if (!baseTheme) {
            baseTheme = bodySettings.customThemes.find(t => t.id === bodySettings.activeCanvasThemeId) ||
                globalThemeRegistry.getTheme('light')!;
        }

        // Apply global styles override on top
        if (bodySettings.styleOverrides && Object.keys(bodySettings.styleOverrides).length > 0) {
            return {
                ...baseTheme,
                styles: {
                    ...baseTheme.styles,
                    ...bodySettings.styleOverrides
                }
            };
        }

        return baseTheme;
    }, [bodySettings.activeCanvasThemeId, bodySettings.customThemes, bodySettings.styleOverrides]);

    // Derive "isDark" for UI contrast (overlays, drop zones)
    // Heuristic: theme id contains 'dark' or we could check backgroundColor brightness
    const isCanvasDark = bodySettings.activeCanvasThemeId === 'dark' ||
        bodySettings.activeCanvasThemeId.includes('dark');

    const canvasTheme = {
        bg: (activeThemeObject.styles.backgroundColor as string) || (isCanvasDark ? '#1e1e1e' : '#ffffff'),
        text: (activeThemeObject.styles.textColor as string) || (isCanvasDark ? '#e5e5e5' : '#171717'),
        link: (activeThemeObject.styles.linkColor as string) || (isCanvasDark ? '#60a5fa' : '#2563eb'),
        primary: (activeThemeObject.styles.primaryColor as string) || (isCanvasDark ? '#3b82f6' : '#2563eb'),
    };

    const toolbarButtonStyle = (isActive: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: isActive ? theme.primaryBg : 'transparent',
        color: isActive ? theme.primaryText : theme.textMuted,
        cursor: 'pointer',
        transition: 'all 0.15s',
    });

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget || e.target === ref.current) {
            onSelectComponent?.(null);
        }
    };

    // React DnD implementation for Root Canvas
    const [{ isOver }, drop] = useDrop({
        accept: [DragTypes.NEW_COMPONENT, DragTypes.CONTAINER, DragTypes.ITEM],
        drop: (item: any, monitor) => {
            if (monitor.didDrop()) return;

            // If dropping a new component from sidebar
            if (item.type === 'NEW_COMPONENT' && item.componentDef) {
                // Add to root
                builderContext.addComponent(item.componentDef, null, components.length); // Add to end
            }
            // If moving an existing component to root
            else if (item.id) {
                builderContext.moveComponent(item.id, item.parentId, null, components.length);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
        }),
    });

    drop(ref);

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.bgSecondary,
                overflow: 'hidden',
            }}
        >
            {/* Canvas Toolbar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    padding: '8px 16px',
                    backgroundColor: theme.bg,
                    borderBottom: `1px solid ${theme.border}`,
                }}
            >
                {/* Device selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px', backgroundColor: theme.bgSecondary, borderRadius: '6px' }}>
                    <button onClick={() => setDeviceType('desktop')} style={toolbarButtonStyle(deviceType === 'desktop')} title="Desktop">
                        <Monitor style={{ width: 16, height: 16 }} />
                    </button>
                    <button onClick={() => setDeviceType('tablet')} style={toolbarButtonStyle(deviceType === 'tablet')} title="Tablet">
                        <Tablet style={{ width: 16, height: 16 }} />
                    </button>
                    <button onClick={() => setDeviceType('mobile')} style={toolbarButtonStyle(deviceType === 'mobile')} title="Mobile">
                        <Smartphone style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Canvas Theme Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>Theme:</span>
                    <select
                        value={bodySettings.activeCanvasThemeId}
                        onChange={(e) => onCanvasThemeChange?.(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {[...globalThemeRegistry.getAllThemes(), ...bodySettings.customThemes].map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start', // Was stretch
                    justifyContent: 'flex-start', // Was center
                    overflow: 'auto',
                    padding: 0, // Was paddingTop: '40px'
                }}
                onClick={handleCanvasClick}
            >
                <div
                    ref={ref}
                    className={`transition-colors duration-300 ${isOver ? 'ring-2 ring-blue-500 ring-inset' : ''} ${isCanvasDark ? 'dark-canvas' : 'light-canvas'}`}
                    style={{
                        width: getCanvasWidth(),
                        maxWidth: activeThemeObject.styles.maxWidth as string || (deviceType === 'desktop' ? 'none' : getCanvasWidth()),
                        margin: activeThemeObject.styles.margin as string || '0 auto',
                        padding: activeThemeObject.styles.sectionPadding as string || '40px 20px',
                        minHeight: activeThemeObject.styles.minHeight as string || '100vh',
                        backgroundColor: activeThemeObject.styles.backgroundColor as string || canvasTheme.bg,
                        color: canvasTheme.text,
                        backgroundImage: activeThemeObject.styles.backgroundImage ? `url(${activeThemeObject.styles.backgroundImage})` : undefined,
                        backgroundSize: (activeThemeObject.styles.backgroundSize as string) || 'cover',
                        backgroundPosition: (activeThemeObject.styles.backgroundPosition as string) || 'center',
                        backgroundRepeat: (activeThemeObject.styles.backgroundRepeat as string) || 'no-repeat',
                        transition: 'width 0.3s ease, background-color 0.3s ease',
                        overflow: 'visible',
                        fontFamily: `'${activeThemeObject.styles.fontFamily || 'Inter'}', system-ui, sans-serif`,
                        fontSize: activeThemeObject.styles.fontSize ? (typeof activeThemeObject.styles.fontSize === 'number' || !activeThemeObject.styles.fontSize.toString().match(/[a-z%]/i) ? `${activeThemeObject.styles.fontSize}px` : activeThemeObject.styles.fontSize.toString()) : '16px',
                        lineHeight: (activeThemeObject.styles.lineHeight as string) || '1.5',
                        display: activeThemeObject.styles.display as string || 'flex',
                        flexDirection: activeThemeObject.styles.flexDirection as any || 'column',
                        justifyContent: activeThemeObject.styles.justifyContent as string || 'flex-start',
                        alignItems: activeThemeObject.styles.alignItems as string || 'stretch',
                        gap: activeThemeObject.styles.gap as string,
                        position: 'relative',
                        boxShadow: '0 0 20px rgba(0,0,0,0.1)', // Subtle shadow
                    }}
                >
                    {components.map((component, index) => (
                        <CanvasComponentRenderer
                            key={component.id}
                            component={component}
                            index={index}
                            parentId={null}
                            builderContext={builderContext}
                            theme={theme} // Pass theme for styling
                            activeThemeObject={activeThemeObject}
                            canvasTheme={canvasTheme}
                        />
                    ))}

                    {components.length === 0 && (
                        <div
                            style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: canvasTheme.text,
                                opacity: 0.4, // isAnythingDragging ? 0.6 : 0.4
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px',
                                pointerEvents: 'none', // Ensure clicks go to the drop target
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    margin: '0 auto 16px',
                                    borderRadius: '12px',
                                    backgroundColor: `${canvasTheme.text}10`, // 10 is hex opacity
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ opacity: 0.5 }}>
                                    {/* Simple Plus Icon SVG if lucide import fails or complexity is high, 
                                        but we have Lucide imports available in this file (Sun, Moon etc). 
                                        Let's try to import Plus at the top first? 
                                        I can't change imports with this tool easily if I don't target the top.
                                        I'll use a standard SVG here to be safe and avoiding import errors mid-file 
                                      */}
                                    <svg
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ color: canvasTheme.text }}
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                    </svg>
                                </div>
                            </div>
                            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                                Drop components here
                            </p>
                            <p style={{ fontSize: '13px', opacity: 0.7 }}>
                                Drag components from the panel to start building
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SelectionOverlay
                selectedId={props.selectedComponentId ?? null}
                builderContext={builderContext}
                theme={theme}
                canvasTheme={canvasTheme}
            />
        </div >
    );
};
