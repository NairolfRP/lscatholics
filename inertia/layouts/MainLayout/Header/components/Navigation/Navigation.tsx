import { NavigationProps } from "@/features/navigation/types/navigation";
import NavigationItem from "@/layouts/MainLayout/Header/components/Navigation/components/NavigationItem/NavigationItem";

export default function Navigation({ menus }: NavigationProps) {
    return menus.map((menu, index) => <NavigationItem key={index} id={index} menu={menu} />);
}
