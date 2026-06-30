/**
 * @file components/layout/public-header.tsx
 * @description Sticky marketing site header with responsive navigation.
 *
 * Desktop: renders inline navigation links and a "ورود به سامانه" CTA button.
 * Mobile: collapses navigation into a slide-in Drawer triggered by a hamburger
 *   menu icon with an animated open/close transition.
 *
 * Navigation links are conditionally generated from env.enableBlog and
 * env.enableContactPage feature flags so the header stays in sync with
 * enabled/disabled public pages without code changes.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { env } from "@/config/env";
import { cn } from "@/lib/cn";
import { MobileMenuIcon } from "@/components/ui/mobile-menu-icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { BrandConfig } from "@/config/branding";

const publicLinks = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  ...(env.enableBlog ? [{ href: "/blog", label: "مقالات" }] : []),
  { href: "/about", label: "درباره ما" },
  ...(env.enableContactPage ? [{ href: "/contact", label: "تماس" }] : []),
];

export function PublicHeader({ brand }: { brand: BrandConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-xl">
      <nav aria-label="ناوبری اصلی" className="page-container flex h-20 items-center gap-7">
        <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="order-first md:hidden"
              aria-label={menuOpen ? "بستن منوی اصلی" : "بازکردن منوی اصلی"}
            >
              <MobileMenuIcon open={menuOpen} />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <DrawerHeader className="mb-5">
              <div className="flex items-center gap-3">
                <BrandLogo label={brand.appName} />
                <DrawerTitle>{brand.appName}</DrawerTitle>
              </div>
              <DrawerDescription>{brand.appDescription}</DrawerDescription>
            </DrawerHeader>
            <nav aria-label="ناوبری موبایل" className="grid gap-1">
              {publicLinks.map((item) => (
                <DrawerClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-3 font-medium transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </DrawerClose>
              ))}
            </nav>
            <DrawerClose asChild>
              <Link href="/login" className={cn(buttonVariants(), "mt-6 w-full")}>
                ورود به سامانه
              </Link>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-extrabold text-[var(--brand-strong)]"
        >
          <BrandLogo priority label={brand.appName} />
          <span>{brand.appShortName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "sm" }), "hidden min-w-32 md:inline-flex")}
          >
            ورود به سامانه
          </Link>
        </div>
      </nav>
    </header>
  );
}
