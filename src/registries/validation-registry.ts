/**
 * Validation Registry for Component Nesting Rules
 * 
 * Defines what components can be dropped into what containers.
 */

type ValidationRule = string[] | ((childType: string) => boolean) | 'ALL' | 'NONE';

class ValidationRegistry {
    private rules: Map<string, ValidationRule>;

    constructor() {
        this.rules = new Map();
    }

    /**
     * Register logic for what a container accepts
     * @param containerType The type of the container (e.g., 'playlist')
     * @param allowedChildren Array of allowed types, function, 'ALL' (default), or 'NONE'
     */
    registerRule(containerType: string, allowedChildren: ValidationRule) {
        this.rules.set(containerType, allowedChildren);
    }

    /**
     * Check if a specific child type can be dropped into a container type
     */
    canDrop(containerType: string, childType: string): boolean {
        // Default to ALL if no rule exists
        const rule = this.rules.get(containerType);

        if (!rule || rule === 'ALL') return true;
        if (rule === 'NONE') return false;

        if (Array.isArray(rule)) {
            return rule.includes(childType);
        }

        if (typeof rule === 'function') {
            return rule(childType);
        }

        return true;
    }
}

export const validationRegistry = new ValidationRegistry();
