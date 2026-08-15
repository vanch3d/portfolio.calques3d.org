"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MobileNavTrigger } from "./MobileNavTrigger";
import { MobileNavPopup } from "./MobileNavPopup";
import type { NavLink } from "../NavLinkItem";

export interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const t = useTranslations("Navigation");
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="up">
      <MobileNavTrigger open={open} label={open ? t("close_menu") : t("open_menu")} />
      <Drawer.Portal>
        <Drawer.Backdrop
          className={cn(
            "fixed inset-0 z-40",
            "bg-neutral-900/50 backdrop-blur-sm",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "transition-opacity duration-300"
          )}
        />
        <MobileNavPopup
          links={links}
          pathname={pathname}
          closeLabel={t("close_menu")}
          wordmark={t("wordmark")}
          mobileNavLabel={t("mobile_nav_label")}
        />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
