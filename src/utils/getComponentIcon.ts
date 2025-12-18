import {
    Type,
    Image,
    LayoutGrid,
    Columns,
    Square,
    Video,
    List,
    Heading,
    MousePointerClick
} from 'lucide-react';
import type { ComponentType } from '../types/component-types';

export const getComponentIcon = (type: ComponentType | string) => {
    switch (type) {
        case 'button':
            return MousePointerClick;
        case 'image':
            return Image;
        case 'container':
        case 'section':
            return LayoutGrid;
        case 'columns':
            return Columns;
        case 'text':
        case 'paragraph':
            return Type;
        case 'heading':
            return Heading;
        case 'video':
            return Video;
        case 'list':
            return List;
        default:
            return Square;
    }
};
