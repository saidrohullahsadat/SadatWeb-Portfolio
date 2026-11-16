import { mobileNavigationLinks } from "../data/navigation";
import NavigationItem from "./NavigationItem";

interface MobileNavigationProps {
  activeSection: string;
}

export default function MobileNavigation({ activeSection }: MobileNavigationProps) {
  return (
    <nav className="mobile-nav glass" aria-label="Mobile navigation">
      {mobileNavigationLinks.map((item) => (
        <NavigationItem key={item.id} item={item} active={activeSection === item.id} compact />
      ))}
    </nav>
  );
}
