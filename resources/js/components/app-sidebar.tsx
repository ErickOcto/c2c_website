import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  Settings05Icon,
  HelpCircleIcon,
  SearchIcon,
  BabyBoyDressIcon,
  ShoppingBag02Icon,
  Package01Icon,
  DeliveryTruck01Icon,
  AnalyticsUpIcon,
} from "@hugeicons/core-free-icons"
import { Link, usePage } from "@inertiajs/react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />
      ),
    },
  ],
  sellerNav: [
    {
      title: "Seller Dashboard",
      url: "/seller/dashboard",
      icon: (
        <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={2} />
      ),
    },
    {
      title: "My Products",
      url: "/seller/products",
      icon: (
        <HugeiconsIcon icon={Package01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Orders",
      url: "/seller/orders",
      icon: (
        <HugeiconsIcon icon={ShoppingBag02Icon} strokeWidth={2} />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Get Help",
      url: "/help",
      icon: (
        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Search",
      url: "/search",
      icon: (
        <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage().props as any;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <HugeiconsIcon icon={BabyBoyDressIcon} strokeWidth={1.6} className="size-8! bg-primary text-primary-foreground p-1 rounded-md" />
                <span className="text-base font-semibold">C2C Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* Seller Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Seller</SidebarGroupLabel>
          <NavMain items={data.sellerNav} />
        </SidebarGroup>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth?.user ?? { name: 'User', email: 'user@example.com', avatar: '' }} />
      </SidebarFooter>
    </Sidebar>
  )
}
