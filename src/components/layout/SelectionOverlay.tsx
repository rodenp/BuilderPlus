import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Copy, Type, X, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';
import { getComponentIcon } from '../../utils/getComponentIcon';
import { RichTextEditor, type RichTextEditorRef } from '../RichTextEditor';

interface SelectionOverlayProps {
    selectedId: string | null;
    builderContext: any;
    theme: Theme;
    canvasTheme?: Theme;
}

// Helper button component for hover effects
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
                background: isHovered ? 'rgba(0, 0, 0, 0.4)' : 'transparent', // Bold hover background
                border: 'none',
                color: color,
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px', // Add radius for better look
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

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({ selectedId, builderContext, theme, canvasTheme }) => {
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [targetType, setTargetType] = useState<string>('');
    const [targetComponent, setTargetComponent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [toolbarMode, setToolbarMode] = useState<'component' | 'text'>('component');
    const editorRef = useRef<RichTextEditorRef>(null);
    const animationFrameRef = useRef<number>();

    // 1. Find Target Element and Update Rect Loop
    useEffect(() => {
        if (!selectedId) {
            setRect(null);
            setTargetComponent(null);
            setIsEditing(false); // Reset editing on deselect
            setToolbarMode('component'); // Reset toolbar mode
            return;
        }

        const updateRect = () => {
            const element = document.getElementById(`component-${selectedId}`);
            if (element) {
                const newRect = element.getBoundingClientRect();
                setRect(newRect);

                const component = builderContext.findContainer(selectedId);
                if (component) {
                    setTargetType(component.type);
                    setTargetComponent(component);
                }
            } else {
                setRect(null);
            }
            animationFrameRef.current = requestAnimationFrame(updateRect);
        };

        // Start loop
        updateRect();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selectedId, builderContext]); // Removed dependencies that might cause loop if not careful

    // Check if component is text-editable
    const isTextEditable = ['heading', 'paragraph', 'text', 'button', 'rich-text', 'text-block'].includes(targetType);

    // Auto-enable editing for text components
    useEffect(() => {
        if (isTextEditable && selectedId && !isEditing) {
            setIsEditing(true);
        }
    }, [isTextEditable, selectedId, isEditing]);

    // PREVENT DOUBLE RENDERING: Hide the underlying target component while editing
    useEffect(() => {
        if (selectedId && isEditing) {
            const element = document.getElementById(`component-${selectedId}`);
            if (element) {
                const originalOpacity = element.style.opacity;
                element.style.opacity = '0';
                return () => {
                    element.style.opacity = originalOpacity;
                };
            }
        }
    }, [selectedId, isEditing]);

    // Handle Escape key to deselect
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditing) {
                    setIsEditing(false);
                } else if (selectedId) {
                    builderContext.selectComponent(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, isEditing, builderContext]);

    const Icon = targetType ? getComponentIcon(targetType) : null;

    if (!rect || !targetType) return null;

    return createPortal(
        <>
            {/* Editor Overlay */}
            {isEditing && targetComponent && (
                <div
                    style={{
                        position: 'fixed',
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        minHeight: rect.height,
                        zIndex: 10000,
                    }}
                >
                    <RichTextEditor
                        ref={editorRef}
                        selectedElement={targetComponent}
                        defaultTextColor={canvasTheme?.text}
                        hideToolbar={true}
                        onContentChange={(content) => {
                            // Update both 'text' and 'content' to support all component types
                            // (Paragraph uses 'text', some legacy/plugins might use 'content')
                            if (builderContext && typeof builderContext.updateComponent === 'function') {
                                builderContext.updateComponent(selectedId, {
                                    props: {
                                        text: content,
                                        content: content
                                    }
                                });
                            }
                        }}
                        onEditingEnd={() => setIsEditing(false)}
                        className="bg-white text-black h-full shadow-lg rounded p-2"
                    />
                </div >
            )
            }

            {/* Toolbar Badge & Outline */}
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
                {/* Outline Frame */}
                <div
                    style={{
                        position: 'absolute',
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        outline: `2px solid ${theme.primary}`,
                        outlineOffset: '-2px',
                        pointerEvents: 'none',
                        transition: 'all 0.05s linear'
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
                        gap: '2px', // Reduce gap as buttons have padding now
                        backgroundColor: theme.primary,
                        color: '#fff',
                        padding: '2px 4px', // Reduce padding as buttons have internal padding
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

                            {/* Edit Text Button -- Always show to allow focusing/context */}
                            {isTextEditable && (
                                <ToolbarIconButton
                                    onClick={() => {
                                        setToolbarMode('text');
                                        if (!isEditing) {
                                            setIsEditing(true);
                                        }
                                    }}
                                    icon={Type}
                                    title="Edit Text"
                                />
                            )}

                            {/* Clone Button */}
                            <ToolbarIconButton
                                onClick={() => {
                                    if (selectedId) builderContext.copyComponent(selectedId);
                                }}
                                icon={Copy}
                                title="Clone"
                            />

                            <ToolbarIconButton
                                onClick={() => {
                                    if (selectedId) builderContext.removeComponent(selectedId);
                                }}
                                icon={Trash2}
                                title="Delete"
                            />

                            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 2px' }} />

                            {/* Done / Deselect Button */}
                            <ToolbarIconButton
                                onClick={() => {
                                    if (builderContext.selectComponent) {
                                        builderContext.selectComponent(null);
                                    }
                                }}
                                icon={X}
                                title="Deselect (Esc)"
                            />
                        </>
                    ) : (
                        <>
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('bold')}
                                icon={Bold}
                                title="Bold"
                            />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('italic')}
                                icon={Italic}
                                title="Italic"
                            />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('underline')}
                                icon={Underline}
                                title="Underline"
                            />
                            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('justifyLeft')}
                                icon={AlignLeft}
                                title="Align Left"
                            />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('justifyCenter')}
                                icon={AlignCenter}
                                title="Align Center"
                            />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.execCommand('justifyRight')}
                                icon={AlignRight}
                                title="Align Right"
                            />
                            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.openLinkModal()}
                                icon={LinkIcon}
                                title="Insert Link"
                            />
                            <ToolbarIconButton
                                onClick={() => editorRef.current?.openImageGallery()}
                                icon={ImageIcon}
                                title="Insert Image"
                            />
                            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', margin: '0 4px' }} />
                            <ToolbarIconButton
                                onClick={() => setToolbarMode('component')}
                                icon={X}
                                title="Close Editor"
                            />
                        </>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
