"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/SearchBar";
import { Upload, Menu, Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleUploadClick = () => {
    router.push("/upload");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                P
              </span>
            </div>
            <span className="font-bold text-xl">PodCast</span>
          </Link>

          {/* Search Bar - Desktop */}
          {isDesktop && (
            <div className="flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button - Mobile */}
            {!isDesktop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-2"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUploadClick}
              size="sm"
              className="hidden sm:flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>

            {/* Mobile Upload Button */}
            <Button
              onClick={handleUploadClick}
              size="sm"
              className="sm:hidden p-2"
            >
              <Upload className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            {!isDesktop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {!isDesktop && showMobileSearch && (
          <div className="border-t px-4 py-3">
            <SearchBar />
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {!isDesktop && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-64 bg-background border-l shadow-lg">
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mb-4 w-full justify-start"
              >
                Close Menu
              </Button>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/discover"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Discover
                </Link>
                <Link
                  href="/search"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search
                </Link>
                <Link
                  href="/library"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Library
                </Link>
                <Link
                  href="/upload"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
