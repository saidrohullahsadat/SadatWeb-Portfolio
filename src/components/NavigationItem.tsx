import type { NavigationLink } from "../data/navigation";

interface NavigationItemProps {
  item: NavigationLink;
  active: boolean;
  compact?: boolean;
}

export default function NavigationItem({ item, active, compact = false }: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <a
      className={`navigation-item${active ? " active" : ""}${compact ? " compact" : ""}`}
      href={`#${item.id}`}
      aria-label={item.label}
      aria-current={active ? "location" : undefined}
      title={item.label}
      data-tooltip={item.label}
    >
      <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
      {compact && <span>{item.label}</span>}
    </a>
  );
}
