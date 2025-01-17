export interface HeaderNavItem {
    name: string;
    link?: string;
    linkParams?: NonNullable<unknown>;
    items?: HeaderNavSubmenuItem[];
}

export interface HeaderNavSubmenuItem extends HeaderNavItem {
    link: string;
}

interface NavigationProps {
    menus: HeaderNavItem[];
}
