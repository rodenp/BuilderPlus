import type { Theme } from '../types/theme';

export class ThemeRegistry {
    private themes: Record<string, Theme> = {};

    constructor() {
        // Register default themes
        this.registerTheme({
            id: 'light',
            name: 'Light',
            mode: 'light',
            styles: {
                backgroundColor: '#ffffff',
                textColor: '#171717',
                linkColor: '#2563eb',
                primaryColor: '#2563eb',
                fontFamily: 'Inter',
                fontSize: '16px',
                lineHeight: '1.5',
                maxWidth: '1200px',
                padding: '20px',
            }
        });

        this.registerTheme({
            id: 'dark',
            name: 'Dark',
            mode: 'dark',
            styles: {
                backgroundColor: '#1e1e1e',
                textColor: '#e5e5e5',
                linkColor: '#60a5fa',
                primaryColor: '#3b82f6',
                fontFamily: 'Inter',
                fontSize: '16px',
                lineHeight: '1.5',
                maxWidth: '1200px',
                padding: '20px',
            }
        });
    }

    /**
     * Public SDK API: registerTheme
     */
    registerTheme(theme: Theme) {
        this.themes[theme.id] = theme;
    }

    /**
     * Get a theme by ID.
     */
    getTheme(id: string): Theme | undefined {
        return this.themes[id];
    }

    /**
     * Get all registered themes.
     */
    getAllThemes(): Theme[] {
        return Object.values(this.themes);
    }
}

// Global singleton instance
export const globalThemeRegistry = new ThemeRegistry();

/**
 * Public SDK API: registerTheme helper
 */
export const registerTheme = (theme: Theme) => {
    globalThemeRegistry.registerTheme(theme);
};
