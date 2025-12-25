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
    builderContext: any;
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

    const activeThemeObject = useMemo(() => {
        const systemTheme = globalThemeRegistry.getTheme(bodySettings.activeCanvasThemeId);
        let baseTheme = systemTheme;

        if (!baseTheme) {
            baseTheme = bodySettings.customThemes.find(t => t.id === bodySettings.activeCanvasThemeId) ||
                globalThemeRegistry.getTheme('light')!;
        }

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

    const [{ isOver }, drop] = useDrop({
        accept: [DragTypes.NEW_COMPONENT, DragTypes.CONTAINER, DragTypes.ITEM],
        drop: (item: any, monitor) => {
            if (monitor.didDrop()) return;

            if (item.id && (item as any).isInstantiated) {
                builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
            }

            const targetIndex = (item as any).index ?? components.length;

            if (item.type === 'NEW_COMPONENT' && item.componentDef) {
                if (item.isInstantiated) return;
                builderContext.addComponent(item.componentDef, null, targetIndex);
            }
            else if (item.id) {
                builderContext.moveComponent(item.id, item.parentId, null, targetIndex);
            }
        },
        hover: (item: any, monitor) => {
            if (!monitor.isOver({ shallow: true })) return;

            const hoverBoundingRect = (ref.current as any).getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
            const isTop = hoverClientY < hoverBoundingRect.height * 0.2;
            const isBottom = hoverClientY > hoverBoundingRect.height * 0.8;

            const targetIndex = isTop ? 0 : components.length;
            const isNew = item.type === DragTypes.NEW_COMPONENT;
            const isCrossParent = item.parentId !== null;
            const isExtreme = isTop || isBottom;

            if (isNew || isCrossParent) {
                if (isNew && item.isInstantiated && item.id) {
                    if (item.parentId === null && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, null, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = null;
                    return;
                }

                if (isNew) {
                    const newId = builderContext.addComponent(
                        { ...item.componentDef, props: { ...item.componentDef.props, isPlaceholder: isExtreme } },
                        null,
                        targetIndex
                    );
                    item.isInstantiated = true;
                    item.id = newId;
                    item.index = targetIndex;
                    item.parentId = null;
                    return;
                }

                if (item.id) {
                    if (item.parentId === null && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, null, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: isExtreme } });
                    item.index = targetIndex;
                    item.parentId = null;
                }
            } else {
                if (item.id) {
                    if (item.parentId === null && item.index === targetIndex) return;
                    builderContext.moveComponent(item.id, item.parentId, null, targetIndex);
                    builderContext.updateComponent(item.id, { props: { isPlaceholder: false } });
                    item.index = targetIndex;
                    item.parentId = null;
                }
            }
        },
        collect: (monitor) => {
            return {
                isOver: monitor.isOver({ shallow: true }),
            };
        },
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

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    overflow: 'auto',
                    padding: 0,
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
                        minHeight: activeThemeObject.styles.minHeight as string || '100vh',
                        backgroundColor: (activeThemeObject.styles.backgroundColor as string) || canvasTheme.bg,
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
                        gap: (activeThemeObject.styles.gap as string),
                        position: 'relative',
                        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                        ...activeThemeObject.styles,
                        // Ensure layout-critical properties aren't accidentally broken by themes
                        padding: (activeThemeObject.styles.sectionPadding as string) || activeThemeObject.styles.padding as string || '0px',
                    }}
                >
                    {components.map((component, index) => (
                        <CanvasComponentRenderer
                            key={component.id}
                            component={component}
                            index={index}
                            parentId={null}
                            builderContext={builderContext}
                            theme={theme}
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
                                opacity: 0.4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px',
                                pointerEvents: 'none',
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
                                    backgroundColor: `${canvasTheme.text}10`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ opacity: 0.5 }}>
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
        </div>
    );
};
