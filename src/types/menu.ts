// Menu Model Type
export interface MenuItem {
    id: string;
    title: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
}

export interface MenuModel {
    items: MenuItem[];
}
