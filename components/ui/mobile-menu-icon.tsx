/**
 * @file components/ui/mobile-menu-icon.tsx
 * @description Animated hamburger / close icon toggle for mobile navigation.
 *
 * Renders a Menu icon (when open=false) and an X icon (when open=true) layered
 * on top of each other with CSS scale/rotate/opacity transitions. Provides a
 * smooth morphing animation between states. The container is aria-hidden because
 * the parent button provides the accessible label.
 */
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function MobileMenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative grid size-5 place-items-center" aria-hidden="true">
      <Menu
        className={cn(
          "absolute size-5 transition-all duration-300",
          open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <X
        className={cn(
          "absolute size-5 transition-all duration-300",
          open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
        )}
      />
    </span>
  );
}
