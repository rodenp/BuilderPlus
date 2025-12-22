import React, { useEffect, useRef, useState } from 'react';

interface RichTextPropertyInputProps {
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
    placeholder?: string;
}

export const RichTextPropertyInput: React.FC<RichTextPropertyInputProps> = ({
    value,
    onChange,
    style,

}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync external value to editor content if not focused (to avoid cursor jumps)
    useEffect(() => {
        if (editorRef.current && !isFocused && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value, isFocused]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            // If empty or just <br>, send empty string
            if (html === '<br>' || html.trim() === '') {
                onChange('');
            } else {
                onChange(html);
            }
        }
    };

    return (
        <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
                setIsFocused(false);
                // Force cleanup or final sync if needed
            }}
            style={{
                ...style,
                overflowY: 'auto',
                minHeight: '80px',
                cursor: 'text',
                whiteSpace: 'pre-wrap', // Preserve wrapping
                outline: 'none',
                // Simulate input/textarea appearance
                border: '1px solid transparent', // Or inherit
            }}
            className="rich-text-property-input"
            role="textbox"
            tabIndex={0}
            suppressContentEditableWarning
        />
    );
};
