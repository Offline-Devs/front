"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
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

const publicLinks = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  ...(env.enableBlog ? [{ href: "/blog", label: "مقالات" }] : []),
  { href: "/about", label: "درباره ما" },
  ...(env.enableContactPage ? [{ href: "/contact", label: "تماس" }] : []),
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <nav aria-label="ناوبری اصلی" className="page-container flex h-16 items-center gap-6">
        <Link href="/" className="text-lg font-extrabold text-primary">
          {env.appShortName}
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "sm" }), "ms-auto hidden md:inline-flex")}
        >
          ورود به سامانه
        </Link>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ms-auto md:hidden"
              aria-label="بازکردن منوی اصلی"
            >
              <Menu className="size-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="mb-5">
              <DrawerTitle>{env.appName}</DrawerTitle>
              <DrawerDescription>{env.appDescription}</DrawerDescription>
            </DrawerHeader>
            <nav aria-label="ناوبری موبایل" className="grid gap-1">
              {publicLinks.map((item) => (
                <DrawerClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-3 font-medium hover:bg-muted"
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
      </nav>
    </header>
  );
}
