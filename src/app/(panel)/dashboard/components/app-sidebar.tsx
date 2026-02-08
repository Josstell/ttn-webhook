"use client";

import * as React from "react";
import {
  ChartLineIcon,
  FileIcon,
  HomeIcon,
  LifeBuoy,
  Send,
  LucideBellElectric,
  Settings2Icon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavMain } from "@/app/(panel)/dashboard/components/nav-main";
import { NavSecondary } from "@/app/(panel)/dashboard/components/nav-secondary";

const data = {
  navMain: [
    {
      title: "Humedad y Temperatura",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Conductividad",
      url: "/dashboard/soil",
      icon: LucideBellElectric,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: ChartLineIcon,
    },
    // {
    //   title: "Orders",
    //   url: "/dashboard/orders",
    //   icon: ShoppingBagIcon,
    // },
    // {
    //   title: "Products",
    //   url: "/dashboard/products",
    //   icon: ShoppingCartIcon,
    // },
    // {
    //   title: "Invoices",
    //   url: "/dashboard/invoices",
    //   icon: FileIcon,
    // },
    // {
    //   title: "Customers",
    //   url: "/dashboard/customers",
    //   icon: UserIcon,
    // },
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: Settings2Icon,
    // },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Retroalimentación",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
