"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShieldAlert,
  UsersRound,
  Settings2,
  File,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import { useTheme } from "@/context/ThemeContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, toggleTheme } = useTheme()

  // Define nav items here so we have access to theme & toggleTheme
  const navMain = [
    {
      title: "Dashboard",
      url: "/officials/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Residents",
      url: "/officials/residentinformation",
      icon: UsersRound,
      items: [
        {
          title: "List",
          url: "/officials/residentinformation/list",
        },
      ],
    },
    {
      title: "Services",
      url: "/officials/service-delivery/maintenance",
      icon: Package,
      items: [
        { title: "Maintenance", url: "/officials/service-delivery/maintenance" },
        { title: "Properties", url: "/officials/service-delivery/projects" },
      ],
    },
    {
      title: "Peace & Order",
      url: "/officials/peaceandorder",
      icon: ShieldAlert,
      items: [
        { title: "Violations / Incidents", url: "/officials/peaceandorder/incidents" },
      ],
    },
    // {
    //   title: "Filing",
    //   url: "/officials/certificate",
    //   icon: ShieldAlert,
    //   items: [
    //     {
    //       title: "Certificates",
    //       url: "/officials/certificate",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
 /* projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
