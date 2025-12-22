import type { Theme } from '../../theme';

export interface PropertyInputProps {
    value: any;
    onChange: (value: any) => void;
    label?: string;
    placeholder?: string;
    theme: Theme;
    // For Select/Icon inputs
    options?: { label: string; value: string }[];
    // For Color inputs
    defaultValue?: string;
    inheritedValue?: string;
    themeDefault?: string;
}
