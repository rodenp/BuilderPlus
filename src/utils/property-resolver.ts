
/**
 * Generic Property Resolver
 * 
 * Implements the verified resolution hierarchy for the Property Panel:
 * 1. User Override (Props on the component instance)
 * 2. Component Default (Static defaults in properties.ts)
 * 3. Theme Value (From the active theme)
 * 4. System Fallback (Final safety net)
 */

export function resolveProperty(
    componentProps: Record<string, any>,
    fieldKey: string,
    componentDefault: any,
    themeStyleValue: any,
    systemFallback?: any
): any {
    // 1. User Override
    // If the user has explicitly set a value (even empty string), use it.
    // We check undefined because empty string or 0 are valid values.
    if (componentProps && componentProps[fieldKey] !== undefined) {
        return componentProps[fieldKey];
    }

    // 2. Component Default
    // If the component "factory setting" exists, it overrides the general theme.
    if (componentDefault !== undefined) {
        return componentDefault;
    }

    // 3. Theme Value
    // If the active theme defines a value for this key (e.g., 'primaryColor')
    if (themeStyleValue !== undefined) {
        return themeStyleValue;
    }

    // 4. System Fallback
    return systemFallback;
}

/**
 * Parse a CSS spacing string (e.g. "10px 20px") into object format.
 * Defaults to 4-value expansion.
 */
export function parseSpacing(value: any): { top: string, right: string, bottom: string, left: string } | undefined {
    if (value === undefined || value === null || value === '') return undefined;

    if (typeof value === 'object') {
        return value;
    }

    const valStr = value.toString().trim();
    const parts = valStr.split(/\s+/);

    let top, right, bottom, left;

    if (parts.length === 1) {
        top = right = bottom = left = parts[0];
    } else if (parts.length === 2) {
        top = bottom = parts[0];
        right = left = parts[1];
    } else if (parts.length === 3) {
        top = parts[0];
        right = left = parts[1];
        bottom = parts[2];
    } else {
        top = parts[0];
        right = parts[1];
        bottom = parts[2];
        left = parts[3];
    }

    return { top, right, bottom, left };
}
