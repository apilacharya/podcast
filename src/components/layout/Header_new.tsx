import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/SearchBar";
import { Upload, Menu, Search } from "lucide-react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

export function Header() {
  const router = useRouter();
  const isDesktop = useIsDesktop();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl">PodCast</span>
        </Link>

        {/* Search Bar - Desktop */}
        {isDesktop && (
          <div className="flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search podcasts and episodes..." />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button - Mobile */}
          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/search")}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Upload Button */}
          <Button
            variant="outline"
            size={isDesktop ? "default" : "icon"}
            onClick={() => router.push("/upload")}
            aria-label="Upload podcast"
          >
            <Upload className="h-4 w-4" />
            {isDesktop && <span className="ml-2">Upload</span>}
          </Button>

          {/* Mobile Menu Button */}
          {!isDesktop && (
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
