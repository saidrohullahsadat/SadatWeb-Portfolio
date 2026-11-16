import {
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Folder,
  GitBranch,
  GraduationCap,
  House,
  MessageCircle,
  UserRound,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavigationLink {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const navigationLinks: NavigationLink[] = [
  { id: "home", label: "Home", icon: House },
  { id: "about", label: "About", icon: UserRound },
  { id: "skills", label: "Skills", icon: ChartNoAxesColumnIncreasing },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "services", label: "Services", icon: Wrench },
  { id: "process", label: "Process", icon: Workflow },
  { id: "github", label: "GitHub", icon: GitBranch },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

export const mobileNavigationLinks = navigationLinks.filter(({ id }) =>
  ["home", "about", "skills", "projects", "contact"].includes(id),
);
