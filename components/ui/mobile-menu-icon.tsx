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
