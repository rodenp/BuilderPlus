export const DragTypes = {
    CONTAINER: 'FLEX_CONTAINER',
    ITEM: 'FLEX_ITEM',
    NEW_COMPONENT: 'NEW_COMPONENT', // For dragging from sidebar
};

export type DragStyle = 'indicator' | 'kanban';

export type DemoItemType = 'track' | 'photo' | 'task' | 'file' | 'note';
// We will extend this with Builder types later
export type ItemType = DemoItemType | string;

export interface ContainerRules {
    allowedItemTypes: ItemType[] | 'all';
    allowedContainerTypes: string[] | 'all';
    allowContainers: boolean;
    allowItems: boolean;
}

export interface Item {
    id: string;
    entityType: 'item';
    itemType: ItemType;
    data: Record<string, unknown>;
}

export interface Container {
    id: string;
    entityType: 'container';
    containerType: string;
    label: string;
    rules: ContainerRules;
    children: (Container | Item)[];
    collapsed?: boolean;
}
