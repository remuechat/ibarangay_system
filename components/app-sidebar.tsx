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
  Moon,
  Sun,
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
import { Separator } from "@/components/ui/separator"

import { useTheme } from "@/context/ThemeContext"

// Mock data - replace with your actual data
const teams = [
  {
    name: "Barangay Officials",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
]

const user = {
  name: "Admin User",
  email: "admin@barangay.gov",
  avatar: "/avatars/admin.png",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  // Define nav items
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
    // Uncomment if you need these sections
    // {
    //   title: "Filing",
    //   url: "/officials/certificate",
    //   icon: File,
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
  ]

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      className="bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="border-border">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      
      <SidebarFooter className="p-2 border-t border-border">
        <div className="flex flex-col gap-2">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="justify-start gap-2 w-full"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
          
          <Separator className="my-1" />
          
          {/* User info */}
          <NavUser user={user} />
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
