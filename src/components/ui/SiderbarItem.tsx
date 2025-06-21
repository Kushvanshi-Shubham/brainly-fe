import type { ReactElement } from "react";
import { useLocation, Link } from "react-router-dom";

interface SidebarItemProps {
  text: string;
  icon?: ReactElement;
  to?: string; // optional link route
}

export function SidebarItem(props: SidebarItemProps) {
  const location = useLocation();
  const isActive = props.to && location.pathname === props.to;

  const baseClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors cursor-pointer";
  const activeClasses =
    "bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300";
  const defaultClasses =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

  const finalClass = `${baseClasses} ${isActive ? activeClasses : defaultClasses}`;

  if (props.to) {
    return (
      <Link to={props.to} className={finalClass}>
        {props.icon && <div>{props.icon}</div>}
        <span>{props.text}</span>
      </Link>
    );
  }

  return (
    <div className={finalClass}>
      {props.icon && <div>{props.icon}</div>}
      <span>{props.text}</span>
    </div>
  );
}
