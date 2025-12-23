
import type { Theme } from '../theme';
import type { CanvasComponent } from '../../../../types/component-types';
import type { MediaItem } from '../../../../types/media';

export interface ComponentPanelProps {
    component: CanvasComponent;
    theme: Theme;
    updateProp: (key: string, value: unknown) => void;
    resolveProp: (key: string) => unknown;
    onOpenMediaGallery?: (onSelect: (item: MediaItem) => void, allowedTypes?: ('image' | 'video' | 'audio' | 'file')[]) => void;
    expandedSections: string[];
    toggleSection: (id: string) => void;
    inheritedProps: Record<string, any>;
    themeDefaults: Record<string, any>;
}
