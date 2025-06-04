"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Library,
  Compass,
  Upload,
  Heart,
  Clock,
  TrendingUp,
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/upload", label: "Upload", icon: Upload },
];

const libraryItems = [
  { href: "/library?tab=favorites", label: "Favorites", icon: Heart },
  { href: "/library?tab=recent", label: "Recently Played", icon: Clock },
  { href: "/library?tab=trending", label: "Trending", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-muted/20 h-[calc(100vh-4rem)]">
      <div className="p-6">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Library Section */}
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your Library
          </h3>
          <nav className="space-y-2">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.includes(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Recently Played Section */}
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recently Played
          </h3>
          <div className="space-y-2">
            {/* This would be populated with actual recent episodes */}
            <div className="text-xs text-muted-foreground">
              No recent episodes
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
