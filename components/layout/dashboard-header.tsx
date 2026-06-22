"use client";

import { LogOut, Menu } from "lucide-react";
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

export function DashboardHeader({ role }: { role: "student" | "admin" }) {
  const logout = useLogout();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="بازکردن منوی پنل">
            <Menu className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mb-6">
            <DrawerTitle>{env.appName}</DrawerTitle>
            <DrawerDescription>
              {role === "admin" ? "دسترسی مدیریت" : "حساب دانش‌آموز"}
            </DrawerDescription>
          </DrawerHeader>
          <DashboardNavigation role={role} />
        </DrawerContent>
      </Drawer>
      <p className="font-bold lg:hidden">{env.appShortName}</p>
      <div className="ms-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => void logout()} aria-label="خروج از حساب">
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
