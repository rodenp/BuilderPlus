import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, Link, FileX, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ImageGallery, type GalleryImage } from './ImageGallery';
import type { CanvasComponent } from '../types/component-types';
import { extractCommonStyles } from './canvas-components/types';
import type { Theme } from './panels/property-panel/theme';

export interface RichTextEditorRef {
    focus: () => void;
    execCommand: (command: string, value?: any) => void;
    openLinkModal: () => void;
    openImageGallery: () => void;
}

interface RichTextEditorProps {
    selectedElement: CanvasComponent;
    onContentChange: (content: string) => void;
    onEditingStart?: () => void;
    onEditingEnd?: () => void;
    className?: string;
    defaultTextColor?: string;
    hideToolbar?: boolean;
    theme?: Theme;
}

export const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(({
    selectedElement,
    onContentChange,
    onEditingStart,


    defaultTextColor,
    hideToolbar,
    theme
}, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [lastElementId, setLastElementId] = useState<string>('');
    const [showToolbar, setShowToolbar] = useState(false);

    // Expose methods to parent
    React.useImperativeHandle(ref, () => ({
        focus: () => {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        },
        execCommand: (command: string, value: any = null) => {
            if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand(command, false, value);
                updateContent();
            }
        },
        openLinkModal: () => {
            const editor = editorRef.current;
            if (editor) {
                editor.focus();
                const selection = window.getSelection();
                const selectedText = selection?.toString().trim() || '';
                let savedRange: Range | null = null;

                if (selection && selection.rangeCount > 0) {
                    savedRange = selection.getRangeAt(0).cloneRange();
                }

                setLinkModal({
                    isOpen: true,
                    linkElement: null,
                    text: selectedText,
                    url: '',
                    isEdit: false,
                    savedRange: savedRange
                });
            }
        },
        openImageGallery: () => {
            const editor = editorRef.current;
            if (editor) {
                editor.focus();
                const selection = window.getSelection();
                let savedRange: Range | null = null;

                if (selection && selection.rangeCount > 0) {
                    savedRange = selection.getRangeAt(0).cloneRange();
                }

                setImageGallery({
                    isOpen: true,
                    savedRange: savedRange
                });
            }
        }
    }));

    const [linkModal, setLinkModal] = useState<{
        isOpen: boolean;
        linkElement: HTMLAnchorElement | null;
        text: string;
        url: string;
        isEdit: boolean;
        savedRange: Range | null;
    }>({
        isOpen: false,
        linkElement: null,
        text: '',
        url: '',
        isEdit: false,
        savedRange: null
    });

    const [imageGallery, setImageGallery] = useState<{
        isOpen: boolean;
        savedRange: Range | null;
    }>({
        isOpen: false,
        savedRange: null
    });

    // Debug modal state changes
    useEffect(() => {
        console.log('Link modal state changed:', linkModal);
    }, [linkModal]);

    const styleLinks = (container: HTMLElement) => {
        const links = container.querySelectorAll('a:not([data-styled])');
        links.forEach((link) => {
            const linkEl = link as HTMLElement;
            linkEl.dataset.styled = 'true'; // Mark as styled

            linkEl.style.setProperty('color', '#2563eb', 'important');
            linkEl.style.setProperty('text-decoration', 'underline', 'important');
            linkEl.style.setProperty('cursor', 'pointer', 'important');
            linkEl.style.setProperty('background-color', 'rgba(37, 99, 235, 0.1)', 'important');
            linkEl.style.setProperty('padding', '1px 2px', 'important');
            linkEl.style.setProperty('border-radius', '2px', 'important');

            // Remove existing click handlers to avoid duplicates
            const newLink = linkEl.cloneNode(true) as HTMLElement;
            newLink.addEventListener('click', handleLinkClick);
            linkEl.parentNode?.replaceChild(newLink, linkEl);
        });
    };

    const handleLinkClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const link = e.target as HTMLAnchorElement;
        setLinkModal({
            isOpen: true,
            linkElement: link,
            text: link.textContent || '',
            url: link.href,
            isEdit: true,
            savedRange: null
        });
    };

    // Sync content from props if changed externally (e.g. Property Panel) and NOT focused
    useEffect(() => {
        if (editorRef.current && selectedElement.id === lastElementId) {
            const currentContent = editorRef.current.innerHTML;
            const rawNew = (selectedElement.props.text as string) || (selectedElement.props.content as string);
            const newContent = (rawNew !== undefined && rawNew !== null && rawNew !== '') ? rawNew : 'Text';

            // Only update if content is different AND we are not the active element (prevent cursor jumping)
            if (currentContent !== newContent && document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = newContent || 'Text';
                styleLinks(editorRef.current);
            }
        }
    }, [selectedElement.props.text, selectedElement.props.content, lastElementId, selectedElement.id]);

    // Initial load and ID change
    useEffect(() => {
        // Assume text components are what we want to edit. 
        // In builderplus this might be 'button' or 'heading' or 'text'
        // For now allowing all as long as they have content/text prop mapping handled by parent
        if (editorRef.current && selectedElement.id !== lastElementId) {
            // Mapping content logic: in builderplus content is often in .props.text
            const rawContent = (selectedElement.props.text as string) || (selectedElement.props.content as string);
            const initialContent = (rawContent !== undefined && rawContent !== null && rawContent !== '') ? rawContent : 'Text';

            editorRef.current.innerHTML = initialContent;
            setLastElementId(selectedElement.id);

            // Style all existing links
            styleLinks(editorRef.current);

            // Listen for custom link modal events
            const handleOpenLinkModal = (e: CustomEvent) => {
                const selectedText = e.detail.selectedText || '';
                const savedRange = e.detail.range || null;
                setLinkModal({
                    isOpen: true,
                    linkElement: null,
                    text: selectedText,
                    url: '',
                    isEdit: false,
                    savedRange: savedRange
                });
            };

            editorRef.current.addEventListener('openLinkModal', handleOpenLinkModal as EventListener);

            // Create a mutation observer to watch for new links being added
            const observer = new MutationObserver((mutations) => {
                let shouldStyle = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // Check if added nodes include an unstyled anchor
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeName === 'A' && !(node as HTMLElement).dataset.styled) {
                                shouldStyle = true;
                            } else if (node.nodeType === 1 && (node as HTMLElement).querySelector('a:not([data-styled])')) {
                                shouldStyle = true;
                            }
                        });
                    }
                });

                if (shouldStyle && editorRef.current) {
                    // Disconnect to avoid infinite loop when we modify DOM
                    observer.disconnect();
                    styleLinks(editorRef.current);
                    observer.observe(editorRef.current, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }
            });

            // Start observing
            observer.observe(editorRef.current, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // Focus the editor after a brief delay
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                    setShowToolbar(true);
                }
            }, 100);

            return () => {
                if (editorRef.current) {
                    editorRef.current.removeEventListener('openLinkModal', handleOpenLinkModal as EventListener);
                }
                observer.disconnect();
            };
        }
    }, [selectedElement.id, lastElementId, selectedElement.type]);

    const updateContent = useCallback(() => {
        if (editorRef.current && onContentChange) {
            let html = editorRef.current.innerHTML;

            // Clean up: Unwrap top-level div/p if they are the only child and have no attributes
            // This prevents "<div>text</div>" from showing in Property Panel as "<div>text</div>" repeatedly
            // and keeps simple text looking like simple text.
            const temp = document.createElement('div');
            temp.innerHTML = html;

            if (temp.childNodes.length === 1) {
                const child = temp.firstChild as HTMLElement;
                if ((child.nodeName === 'DIV' || child.nodeName === 'P') && child.attributes.length === 0) {
                    html = child.innerHTML;
                }
            } else if (html === '<br>') {
                html = '';
            }

            onContentChange(html);
        }
    }, [onContentChange]);

    const saveLinkModal = () => {
        const { linkElement, text, url, isEdit, savedRange } = linkModal;

        if (text.trim() && url.trim()) {
            const finalUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') ? url : 'https://' + url;

            if (isEdit && linkElement) {
                // Update existing link
                linkElement.textContent = text;
                linkElement.href = finalUrl;
            } else {
                // Create new link - properly handle text replacement
                const editor = editorRef.current;
                if (editor) {
                    editor.focus();

                    const linkHtml = `<a href="${finalUrl}" style="color: #2563eb !important; text-decoration: underline !important; cursor: pointer !important; background-color: rgba(37, 99, 235, 0.1) !important; padding: 1px 2px !important; border-radius: 2px !important;">${text}</a>`;

                    if (savedRange) {
                        // Restore the saved selection and replace it
                        const selection = window.getSelection();
                        selection?.removeAllRanges();
                        selection?.addRange(savedRange);
                        document.execCommand('insertHTML', false, linkHtml);
                    } else {
                        // Fallback: insert at current cursor position
                        document.execCommand('insertHTML', false, linkHtml);
                    }
                }
            }
            updateContent();

            // Re-style all links after a short delay
            setTimeout(() => {
                if (editorRef.current) {
                    styleLinks(editorRef.current);
                }
            }, 100);
        }

        setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
    };

    const deleteLinkModal = () => {
        const { linkElement } = linkModal;
        if (linkElement) {
            const text = linkElement.textContent || '';
            const textNode = document.createTextNode(text);
            linkElement.parentNode?.replaceChild(textNode, linkElement);
            updateContent();
        }
        setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
    };

    const handleImageSelect = (image: GalleryImage) => {
        const { savedRange } = imageGallery;
        const editor = editorRef.current;

        if (editor) {
            // First focus the editor to ensure it's active
            editor.focus();

            const imageHtml = `<img src="${image.url}" alt="${image.name || 'Inserted image'}" style="max-width: 100%; height: auto; margin: 8px 0; border-radius: 4px; display: inline-block;" draggable="false" />`;

            if (savedRange) {
                try {
                    // Restore the saved selection and insert at that exact position
                    const selection = window.getSelection();
                    if (selection) {
                        selection.removeAllRanges();

                        // Ensure the range is still valid and within the editor
                        if (editor.contains(savedRange.startContainer)) {
                            selection.addRange(savedRange);

                            // Use insertHTML to insert at the exact cursor position
                            if (document.execCommand('insertHTML', false, imageHtml)) {
                                console.log('Image inserted successfully at saved position');
                            } else {
                                // Fallback: create text node and insert manually
                                const img = document.createElement('img');
                                img.src = image.url;
                                img.alt = image.name || 'Inserted image';
                                img.style.maxWidth = '100%';
                                img.style.height = 'auto';
                                img.style.margin = '8px 0';
                                img.style.borderRadius = '4px';
                                img.style.display = 'inline-block';
                                img.draggable = false;

                                savedRange.insertNode(img);
                                savedRange.setStartAfter(img);
                                savedRange.collapse(true);
                                selection.removeAllRanges();
                                selection.addRange(savedRange);
                            }
                        } else {
                            console.log('Saved range is no longer valid, inserting at end');
                            // Range is no longer valid, insert at end of editor
                            editor.appendChild(document.createElement('br'));
                            const img = document.createElement('img');
                            img.src = image.url;
                            img.alt = image.name || 'Inserted image';
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.margin = '8px 0';
                            img.style.borderRadius = '4px';
                            img.style.display = 'inline-block';
                            img.draggable = false;
                            editor.appendChild(img);
                        }
                    }
                } catch (error) {
                    console.error('Error restoring selection:', error);
                    // Fallback to inserting at current position
                    document.execCommand('insertHTML', false, imageHtml);
                }
            } else {
                // No saved range, insert at current cursor position
                console.log('No saved range, inserting at current cursor position');
                document.execCommand('insertHTML', false, imageHtml);
            }

            updateContent();
        }

        setImageGallery({ isOpen: false, savedRange: null });
    };


    const renderToolbar = () => {
        if (!showToolbar || !editorRef.current) return null;



        return (
            <div
                className="absolute bottom-full right-0 mb-0 opacity-100 z-[9999] flex gap-1 bg-white rounded-md shadow-lg p-1 border border-slate-200"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <>
                    {/* Text Formatting Group */}
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('bold', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Bold"
                        >
                            <Bold size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('italic', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Italic"
                        >
                            <Italic size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('underline', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Underline"
                        >
                            <Underline size={14} />
                        </button>
                    </div>

                    {/* Alignment Group */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('justifyLeft', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Align Left"
                        >
                            <AlignLeft size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('justifyCenter', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Align Center"
                        >
                            <AlignCenter size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('justifyRight', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Align Right"
                        >
                            <AlignRight size={14} />
                        </button>
                    </div>
                </>

                {/* Advanced Tools */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Link button clicked');
                                const editor = editorRef.current;
                                if (editor) {
                                    editor.focus();
                                    const selection = window.getSelection();
                                    const selectedText = selection?.toString().trim() || '';
                                    let savedRange: Range | null = null;

                                    if (selection && selection.rangeCount > 0) {
                                        savedRange = selection.getRangeAt(0).cloneRange();
                                    }

                                    setLinkModal({
                                        isOpen: true,
                                        linkElement: null,
                                        text: selectedText,
                                        url: '',
                                        isEdit: false,
                                        savedRange: savedRange
                                    });
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Add Link"
                        >
                            <Link size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const editor = editorRef.current;
                                if (editor) {
                                    editor.focus();
                                    const selection = window.getSelection();
                                    let savedRange: Range | null = null;

                                    if (selection && selection.rangeCount > 0) {
                                        savedRange = selection.getRangeAt(0).cloneRange();
                                    }

                                    setImageGallery({
                                        isOpen: true,
                                        savedRange: savedRange
                                    });
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Add Image"
                        >
                            <Image size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    document.execCommand('removeFormat', false);
                                    updateContent();
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 transition-colors"
                            title="Clear Formatting"
                        >
                            <FileX size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative pointer-events-auto" style={{ width: '100%' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                    #rich-editor-${selectedElement.id} a {
                        color: #2563eb !important;
                        text-decoration: underline !important;
                        cursor: pointer !important;
                        font-weight: inherit !important;
                        background-color: rgba(37, 99, 235, 0.1) !important;
                        padding: 1px 2px !important;
                        border-radius: 2px !important;
                    }
                    #rich-editor-${selectedElement.id} a:hover {
                        text-decoration: underline !important;
                        background-color: rgba(37, 99, 235, 0.2) !important;
                    }
                    #rich-editor-${selectedElement.id} img {
                        cursor: pointer !important;
                        transition: all 0.2s ease !important;
                        border: 2px solid transparent !important;
                    }
                    #rich-editor-${selectedElement.id} img:hover {
                        border-color: #e5e7eb !important;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    }
                    #rich-editor-${selectedElement.id} img:focus {
                        outline: 2px solid #3b82f6 !important;
                        outline-offset: 2px !important;
                        border-color: #3b82f6 !important;
                    }
                `
            }} />

            {/* Editor Area */}
            <div
                ref={editorRef}
                id={`rich-editor-${selectedElement.id}`}
                contentEditable
                suppressContentEditableWarning
                onInput={updateContent}
                onBlur={() => {
                    updateContent();
                    // if (onEditingEnd) onEditingEnd(); // Optional: call parent handler if needed
                }}
                onFocus={() => {
                    setShowToolbar(true);
                    if (onEditingStart) onEditingStart();
                }}
                data-placeholder="Text"
                className={`outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--placeholder-color)]`}
                style={{
                    ['--placeholder-color' as any]: theme?.textMuted || '#94a3b8',
                    // Apply all common styles first (border, margin, padding, radius, font...)
                    ...extractCommonStyles(selectedElement.props),

                    // Then apply critical layout overrides
                    minHeight: '1em',
                    cursor: 'text',
                    outline: 'none', // Ensure no browser outline
                    // We typically want 0 margin in the editor to align with the overlay rect, 
                    // BUT if the component has margins, the overlay rect ALREADY includes them (or excludes them depending on box logic).
                    // The Overlay is positioned at rect.top/left. If the component has margin, the rect includes it?
                    // Answer: getBoundingClientRect includes padding/border, but NOT margin.
                    // If we apply margin here, we might double it?
                    // Actually, if we are positioned ABSOLUTELY over the element, we want to match its *visible box*.
                    // Common styles includes margin. We should probably reset margin to 0 for the editor itself 
                    // because the overlay container is already positioned. 
                    margin: 0,

                    // Critical: Respect user's scroll choice unconditionally
                    overflowY: (selectedElement.props.overflow as any) || 'auto',

                    // Colors - use specific props or fallbacks
                    backgroundColor: (selectedElement.props.backgroundColor === 'inherit' || !selectedElement.props.backgroundColor)
                        ? 'transparent'
                        : (selectedElement.props.backgroundColor as string) || (selectedElement.props.style as any)?.backgroundColor || undefined,
                    color: (selectedElement.props.textColor === 'inherit' || !selectedElement.props.textColor)
                        ? (defaultTextColor || 'inherit')
                        : (selectedElement.props.textColor as string) || (selectedElement.props.color as string) || (selectedElement.props.style as any)?.color || defaultTextColor || 'inherit',

                    // Layout resets
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    ['--tw-prose-body' as any]: 'inherit',
                    ['--tw-prose-headings' as any]: 'inherit',
                }}
            />
            <style>{`
                /* Scoped reset for p tags inside the specific editor instance */
                #rich-editor-${selectedElement.id} p, 
                #rich-editor-${selectedElement.id} h1, 
                #rich-editor-${selectedElement.id} h2, 
                #rich-editor-${selectedElement.id} h3, 
                #rich-editor-${selectedElement.id} h4, 
                #rich-editor-${selectedElement.id} h5, 
                #rich-editor-${selectedElement.id} h6,
                #rich-editor-${selectedElement.id} ul,
                #rich-editor-${selectedElement.id} ol,
                #rich-editor-${selectedElement.id} li {
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: inherit !important; /* Ensure tight line height */
                }
                /* Ensure the editor itself doesn't have extra block spacing */
                #rich-editor-${selectedElement.id} {
                    display: block;
                }
            `}</style>

            {/* Toolbar - Positioned outside top-right */}
            {!hideToolbar && renderToolbar()}

            {/* Link Modal */}
            {linkModal.isOpen && typeof document !== 'undefined' && document.body && createPortal(
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
                        }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div
                        className="rounded-lg p-6 w-96 mx-4 shadow-xl"
                        style={{
                            backgroundColor: theme?.bg || '#ffffff',
                            color: theme?.text || '#000000',
                            border: `1px solid ${theme?.border || '#e2e8f0'}`
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4" style={{ color: theme?.text }}>
                            {linkModal.isEdit ? 'Edit Link' : 'Add Link'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Text
                                </label>
                                <input
                                    type="text"
                                    value={linkModal.text}
                                    onChange={(e) => setLinkModal(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    style={{
                                        backgroundColor: theme?.bgSecondary || '#f9fafb',
                                        color: theme?.text || '#000000',
                                        borderColor: theme?.border || '#d1d5db'
                                    }}
                                    placeholder="Enter link text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={linkModal.url}
                                    onChange={(e) => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    style={{
                                        backgroundColor: theme?.bgSecondary || '#f9fafb',
                                        color: theme?.text || '#000000',
                                        borderColor: theme?.border || '#d1d5db'
                                    }}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <div>
                                {linkModal.isEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteLinkModal();
                                        }}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        Delete Link
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null })}
                                    className="px-4 py-2 rounded-md transition-colors"
                                    style={{ color: theme?.textMuted, backgroundColor: theme?.bgTertiary }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveLinkModal}
                                    className="px-4 py-2 text-white rounded-md transition-colors"
                                    style={{ backgroundColor: theme?.primary || '#3b82f6' }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Reuse ImageGallery modal */}
            <ImageGallery
                isOpen={imageGallery.isOpen}
                onClose={() => setImageGallery({ isOpen: false, savedRange: null })}
                onImageSelect={handleImageSelect}
                mode="picker"
                theme={theme}
            />
        </div>
    );
});
