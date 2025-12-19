import type { GlobalStyles } from './bodySettings';

export interface Theme {
    id: string;
    name: string;
    description?: string;
    mode?: 'light' | 'dark';
    styles: GlobalStyles;
}
