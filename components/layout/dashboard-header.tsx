"use client";

import { Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { env } from "@/config/env";
import { DashboardNavigation } from "./dashboard-navigation";
import { useLogout } from "@/hooks/use-logout";
import { MobileMenuIcon } from "@/components/ui/mobile-menu-icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileAvatar } from "./profile-avatar";
import { BrandLogo } from "@/components/ui/brand-logo";

export function DashboardHeader({ role }: { role: "student" | "admin" }) {
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-3 border-b border-border/80 bg-card/95 px-4 backdrop-blur-xl sm:px-8">
      <ProfileAvatar role={role} />
      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "بستن منوی پنل" : "بازکردن منوی پنل"}
          >
            <MobileMenuIcon open={menuOpen} />
          </Button>
        </DrawerTrigger>
        <DrawerContent side="right">
          <DrawerHeader className="mb-6">
            <div className="flex items-center gap-3">
              <BrandLogo />
              <DrawerTitle>{env.appName}</DrawerTitle>
            </div>
            <DrawerDescription>
              {role === "admin" ? "دسترسی مدیریت" : "حساب دانش‌آموز"}
            </DrawerDescription>
          </DrawerHeader>
          <DashboardNavigation role={role} />
        </DrawerContent>
      </Drawer>
      <div>
        <p className="font-bold text-[var(--brand-strong)] lg:hidden">{env.appShortName}</p>
        <p className="hidden text-sm font-bold text-[var(--brand-strong)] lg:block">
          {role === "admin" ? "پنل مدیریت" : "پنل دانش‌آموز"}
        </p>
        <p className="hidden text-xs text-muted-foreground lg:block">مدیریت و تحلیل مسیر آموزشی</p>
      </div>
      <div className="ms-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="اعلان‌ها">
          <Bell className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => void logout()} aria-label="خروج از حساب">
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
