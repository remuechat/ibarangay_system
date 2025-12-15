"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  LayoutDashboard,
  Package,
  PieChart,
  Settings2,
  ShieldAlert,
  UsersRound,
} from "lucide-react"

import Logob from "@/public/logob.png"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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

// This is sample data.
const data = {
  user: {
    name: "juanluna",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "iBarangay",
      logo: GalleryVerticalEnd,
      plan: "Management System",
    },
  ],
  navMain: [
    { 
      title: "Dashboard",
      url: "/officials/dashboard",
      icon: LayoutDashboard,
    },

    { title: "Residents",
      url: "/officials/residentinformation",
      icon: UsersRound,
      isActive: true,
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
        {
          title: "Maintenance",
          url: "/officials/service-delivery/maintenance",
        },
        {
          title: "Properties",
          url: "/officials/service-delivery/projects",
        }
      ],
    },
    {
      title: "Peace & Order",
      url: "/officials/peaceandorder",
      icon: ShieldAlert,
      items: [
        {
          title: "Violations / Incidents",
          url: "/officials/peaceandorder/incidents",
        },
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
  ],
} */
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" 
          onClick={() => {
            router.push('/')
          }}>

          Log out

        </Button>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
