import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Trash2, Copy, Type, X, Bold, Italic, Underline,
    Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';
import { getComponentIcon } from '../../utils/getComponentIcon';
import { RichTextEditor, type RichTextEditorRef } from '../RichTextEditor';

interface SelectionOverlayProps {
    selectedId: string | null;
    builderContext: any;
    theme: Theme;
}

// Helper button component for consistent toolbar styling
const ToolbarIconButton: React.FC<{
    onClick: (e: React.MouseEvent) => void;
    icon: React.ElementType;
    title: string;
    size?: number;
    color?: string;
}> = ({ onClick, icon: Icon, title, size = 14, color = 'inherit' }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isHovered ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
                border: 'none',
                color: color,
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.1s'
            }}
            title={title}
        >
            <Icon size={size} />
        </button>
    );
};

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({ selectedId, builderContext, theme }) => {
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [innerRect, setInnerRect] = useState<DOMRect | null>(null); // For tight editor positioning
    const [targetType, setTargetType] = useState<string>('');
    const [targetComponent, setTargetComponent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [toolbarMode, setToolbarMode] = useState<'component' | 'text'>('component');

    const editorRef = useRef<RichTextEditorRef>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    // 1. Hook Order - Must be before any early returns
    useEffect(() => {
        if (!selectedId) {
            setRect(null);
            setInnerRect(null);
            setTargetComponent(null);
            setIsEditing(false);
            setToolbarMode('component');
            return;
        }

        const updateRect = () => {
            const wrapper = document.getElementById(`component-${selectedId}`);
            if (wrapper) {
                // Wide rect: the full container (for the blue selection frame)
                const wideRect = wrapper.getBoundingClientRect();
                setRect(wideRect);

                // Tight rect: the actual button or text element (for the editor overlay)
                const actualElement = wrapper.firstElementChild || wrapper;
                setInnerRect(actualElement.getBoundingClientRect());

                const component = builderContext.findContainer(selectedId);
                if (component) {
                    setTargetType(component.type);
                    setTargetComponent(component);
                }
            } else {
                setRect(null);
                setInnerRect(null);
            }
            animationFrameRef.current = requestAnimationFrame(updateRect);
        };

        updateRect();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selectedId, builderContext]);

    // 2. Fix Double Border by suppressing the renderer's outline via DOM
    useEffect(() => {
        if (selectedId) {
            const wrapper = document.getElementById(`component-${selectedId}`);
            if (wrapper) {
                const originalOutline = wrapper.style.outline;
                wrapper.style.setProperty('outline', 'none', 'important');
                return () => {
                    wrapper.style.outline = originalOutline;
                };
            }
        }
    }, [selectedId]);

    // Characterize components
    const isRichText = ['paragraph', 'rich-text', 'text-block'].includes(targetType);
    const isSimpleEditable = ['heading', 'text', 'button'].includes(targetType);
    const isTextEditable = isRichText || isSimpleEditable;

    // 3. Auto-hiding component during edit
    useEffect(() => {
        if (selectedId && isEditing && isTextEditable) {
            const wrapper = document.getElementById(`component-${selectedId}`);
            if (wrapper) {
                const elementToHide = wrapper.firstElementChild || wrapper;
                const originalOpacity = (elementToHide as HTMLElement).style.opacity;
                (elementToHide as HTMLElement).style.opacity = '0';
                return () => {
                    (elementToHide as HTMLElement).style.opacity = originalOpacity;
                };
            }
        }
    }, [selectedId, isEditing, isTextEditable]);

    // 4. Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditing) {
                    setIsEditing(false);
                    setToolbarMode('component'); // Exit text editing mode
                } else if (selectedId) {
                    builderContext.selectComponent(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, isEditing, builderContext]);

    const Icon = targetType ? getComponentIcon(targetType) : null;

    if (!rect || !innerRect || !targetType) return null;

    // EDITOR OVERLAY (Tight positioning)
    const editorOverlay = isEditing && targetComponent && isTextEditable && (
        createPortal(
            <div
                style={{
                    position: 'fixed',
                    top: innerRect.top,
                    left: innerRect.left,
                    width: innerRect.width,
                    minHeight: innerRect.height,
                    zIndex: 10000,
                    overflow: 'hidden'
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <RichTextEditor
                    ref={editorRef}
                    selectedElement={targetComponent}
                    hideToolbar={true}
                    onContentChange={(content) => {
                        builderContext.updateComponent(selectedId, { props: { text: content, content: content } });
                    }}
                    onEditingEnd={() => setIsEditing(false)}
                    className="pointer-events-auto h-full"
                />
            </div>,
            document.body
        )
    );

    // FRAME & TOOLBAR (Wide positioning)
    return (
        <>
            {editorOverlay}
            {createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '0px',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                >
                    {/* Wide Selection Frame */}
                    <div
                        style={{
                            position: 'absolute',
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                            outline: `2px solid ${theme.primary}`,
                            outlineOffset: '-2px',
                            pointerEvents: 'none'
                        }}
                    />

                    {/* Toolbar Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: rect.top,
                            left: rect.left,
                            transform: 'translateY(-100%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px', // Tighter gap for the buttons
                            backgroundColor: theme.primary,
                            color: '#fff',
                            padding: '2px 4px',
                            borderRadius: '4px 4px 0 0',
                            fontSize: '11px',
                            fontWeight: 500,
                            pointerEvents: 'auto',
                            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                        }}
                    >
                        {toolbarMode === 'component' ? (
                            <>
                                {Icon && <div style={{ padding: '4px' }}><Icon size={12} /></div>}
                                <span style={{ marginRight: '4px' }}>{targetType}</span>
                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 2px' }} />

                                {/* T-Icon: Swaps to Formatting mode. Only for rich-text types. */}
                                {isRichText && (
                                    <ToolbarIconButton
                                        onClick={() => {
                                            setIsEditing(true);
                                            setToolbarMode('text');
                                        }}
                                        icon={Type}
                                        title="Format Text"
                                    />
                                )}

                                {/* Clone Button */}
                                <ToolbarIconButton
                                    onClick={() => { if (selectedId) builderContext.copyComponent(selectedId); }}
                                    icon={Copy}
                                    title="Clone"
                                />

                                {/* Delete Button */}
                                <ToolbarIconButton
                                    onClick={() => { if (selectedId) builderContext.removeComponent(selectedId); }}
                                    icon={Trash2}
                                    title="Delete"
                                />

                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 2px' }} />

                                {/* Deselect Button */}
                                <ToolbarIconButton
                                    onClick={() => builderContext.selectComponent(null)}
                                    icon={X}
                                    title="Deselect (Esc)"
                                />
                            </>
                        ) : (
                            <>
                                {/* Text Formatting Toolbar */}
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('bold')} icon={Bold} title="Bold" />
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('italic')} icon={Italic} title="Italic" />
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('underline')} icon={Underline} title="Underline" />
                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('justifyLeft')} icon={AlignLeft} title="Align Left" />
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('justifyCenter')} icon={AlignCenter} title="Align Center" />
                                <ToolbarIconButton onClick={() => editorRef.current?.execCommand('justifyRight')} icon={AlignRight} title="Align Right" />
                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />
                                <ToolbarIconButton onClick={() => editorRef.current?.openLinkModal()} icon={LinkIcon} title="Insert Link" />
                                <ToolbarIconButton onClick={() => editorRef.current?.openImageGallery()} icon={ImageIcon} title="Insert Image" />
                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />

                                {/* Back to Component Mode */}
                                <ToolbarIconButton
                                    onClick={() => setToolbarMode('component')}
                                    icon={X}
                                    title="Back"
                                />
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
