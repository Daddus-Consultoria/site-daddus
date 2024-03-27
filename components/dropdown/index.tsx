import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface DropdownProps {
  title: string;
  contentComponent: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, contentComponent }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-bold bg-[#A90920] text-white">
            {title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-10 ">
            {contentComponent}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { Dropdown };
