/**
 * Strips HTML tags from a string and returns plain text.
 * Also decodes common HTML entities.
 */
export function stripHtml(html: string): string {
    if (!html) return '';

    // 1. Remove script and style elements
    let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');

    // 2. Replace common block elements with newlines to preserve some structure
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n');
    text = text.replace(/<\/div>/gi, '\n');
    text = text.replace(/<\/h[1-6]>/gi, '\n');

    // 3. Remove all other tags
    text = text.replace(/<[^>]+>/g, '');

    // 4. Decode common entities
    const entities: Record<string, string> = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&copy;': '©',
        '&reg;': '®'
    };

    Object.entries(entities).forEach(([entity, char]) => {
        text = text.replace(new RegExp(entity, 'g'), char);
    });

    // 5. Clean up multiple newlines/spaces
    text = text.replace(/\n\s*\n/g, '\n');

    return text.trim();
}
