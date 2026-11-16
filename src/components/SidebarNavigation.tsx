import { navigationLinks } from "../data/navigation";
import NavigationItem from "./NavigationItem";

interface SidebarNavigationProps {
  activeSection: string;
}

export default function SidebarNavigation({ activeSection }: SidebarNavigationProps) {
  return (
    <nav className="sidebar-nav glass" aria-label="Primary navigation">
      {navigationLinks.map((item) => (
        <NavigationItem key={item.id} item={item} active={activeSection === item.id} />
      ))}
    </nav>
  );
}
