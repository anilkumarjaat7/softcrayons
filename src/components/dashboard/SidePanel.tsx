"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { type LucideIcon, ChevronDown, ChevronLeft, ChevronRight, Gauge, LogOut, Moon, ShieldCheck, Sun, Circle } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export type DashboardSubNavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export type DashboardNavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  subItems?: DashboardSubNavItem[];
};

export type DashboardUser = {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  image?: string;
};

export type DashboardSidePanelProps = {
  brand: {
    name: string;
    logo?: string;
    href?: string;
    label?: string;
  };
  navItems: DashboardNavItem[];
  user: DashboardUser;
};

const statusStyles: Record<DashboardUser["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
};

function NavItemWithSub({
  item,
  pathname,
  collapsed,
  isExpanded,
  onToggleExpand,
}: {
  item: DashboardNavItem;
  pathname: string;
  collapsed: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isActive = pathname === item.href || (item.href !== "/dashboard/admin" && pathname.startsWith(`${item.href}/`));
  const isSubActive = item.subItems?.some(
    (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
  ) || false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }
    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  useEffect(() => {
    if (!collapsed) {
      setShowPopover(false);
    }
  }, [collapsed]);

  const handleClick = () => {
    if (collapsed) {
      setShowPopover(!showPopover);
    } else {
      onToggleExpand();
    }
  };

  const checkSubItemActive = (subHref: string) => {
    if (pathname === subHref) return true;
    if (pathname.startsWith(`${subHref}/`)) {
      const otherSubItems = item.subItems?.filter(s => s.href !== subHref) || [];
      const hasCloserMatch = otherSubItems.some(
        other => pathname === other.href || pathname.startsWith(`${other.href}/`)
      );
      return !hasCloserMatch;
    }
    return false;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-0 hover:bg-transparent",
          (isActive || isSubActive) && !collapsed && "bg-primary/10 text-primary",
          (isActive || isSubActive) && collapsed && "text-primary bg-transparent"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
            (isActive || isSubActive) ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
          )}
        >
          {item.icon ? <item.icon className="h-4 w-4" /> : <Gauge className="h-4 w-4" />}
        </div>
        <span className={cn("flex-1 truncate text-left transition-all duration-200", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>{item.title}</span>
        {!collapsed && (
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        )}
      </button>
      
      {isExpanded && !collapsed && item.subItems && (
        <div className="ml-10 mt-1 space-y-1 border-l border-border pl-3">
          {item.subItems.map((subItem) => {
            const isSubItemActive = checkSubItemActive(subItem.href);
            const SubIcon = subItem.icon || Circle;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isSubItemActive && "bg-primary/10 text-primary font-medium"
                )}
              >
                <SubIcon className="h-3 w-3" />
                {subItem.title}
              </Link>
            );
          })}
        </div>
      )}

      {collapsed && showPopover && item.subItems && (
        <div
          ref={popoverRef}
          className="absolute left-full top-0 z-[100] ml-2 min-w-[180px] rounded-lg border border-border bg-card p-2 shadow-lg"
        >
          <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {item.title}
          </div>
          <div className="space-y-1">
            {item.subItems.map((subItem) => {
              const isSubItemActive = checkSubItemActive(subItem.href);
              const SubIcon = subItem.icon || Circle;
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={() => setShowPopover(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isSubItemActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <SubIcon className="h-4 w-4" />
                  {subItem.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardSidePanel({ brand, navItems, user }: DashboardSidePanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    for (const item of navItems) {
      if (item.subItems?.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`))) {
        return item.title;
      }
    }
    return null;
  });
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const handleToggleExpand = (title: string) => {
    setExpandedItem(prev => prev === title ? null : title);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      <div className="flex h-full w-full flex-col gap-4 overflow-hidden px-3 py-4">
        <div className={cn("flex items-center gap-3 px-1", collapsed && "flex-col")}>
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
            !collapsed && "border border-primary/30 bg-primary/10"
          )}>
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={brand.name}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            ) : (
              <ShieldCheck className="h-5 w-5 text-primary" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{brand.label || "Dashboard"}</p>
              {brand.href ? (
                <Link href={brand.href} className="block truncate text-sm font-bold text-foreground hover:text-primary transition-colors">
                  {brand.name}
                </Link>
              ) : (
                <span className="block truncate text-sm font-bold text-foreground">{brand.name}</span>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className={cn(
          "rounded-xl p-3 transition-all duration-200",
          !collapsed && "border border-border bg-muted/30",
          collapsed && "p-0 flex justify-center"
        )}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className={cn(
              "shrink-0 transition-all duration-200",
              !collapsed && "ring-2 ring-primary/20 ring-offset-2 ring-offset-card h-11 w-11",
              collapsed && "h-10 w-10"
            )}>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                    {user.role}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border", statusStyles[user.status])}>
                    {user.status === "active" ? "Active" : user.status === "pending" ? "Pending" : "Disabled"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            if (hasSubItems) {
              return (
                <NavItemWithSub
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  isExpanded={expandedItem === item.title}
                  onToggleExpand={() => handleToggleExpand(item.title)}
                />
              );
            }

            const isActive = pathname === item.href || (item.href !== "/dashboard/admin" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0 hover:bg-transparent",
                  isActive && !collapsed && "bg-primary/10 text-primary",
                  isActive && collapsed && "text-primary bg-transparent"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                  )}
                >
                  {item.icon ? <item.icon className="h-4 w-4" /> : <Gauge className="h-4 w-4" />}
                </div>
                <span className={cn("flex-1 truncate transition-all duration-200", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>{item.title}</span>
                {item.badge && !collapsed ? (
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-[10px] font-semibold text-primary px-1.5 py-0"
                  >
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t border-border pt-3", collapsed && "flex justify-center")}>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 w-full",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              collapsed && "w-auto justify-center px-0"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </div>
            <span className={cn("flex-1 truncate text-left transition-all duration-200", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
              Logout
            </span>
          </button>
        </div>

        <div className={cn(collapsed && "flex justify-center")}>
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 w-full",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "w-auto justify-center px-0"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </div>
            <span className={cn("flex-1 truncate text-left transition-all duration-200", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
