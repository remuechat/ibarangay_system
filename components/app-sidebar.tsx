"use client"

import * as React from "react"
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "iBarangay",
      logo: GalleryVerticalEnd,
      plan: "Tech System",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    { 
      title: "Dashboard",
      url: "/officials",
      icon: LayoutDashboard,
    },

    { title: "Resident Information",
      url: "/officials/residentinformation",
      icon: UsersRound,
      isActive: true,
      items: [
        {
          title: "Profiles",
          url: "/officials/residentinformation",
        },
        {
          title: "See Purok",
          url: "/officials/residentinformation",
        },
      ],
    },
    {
      title: "Service Delivery",
      url: "/officials/service-delivery/maintenance",
      icon: Package,
      items: [
        {
          title: "Maintenance",
          url: "/officials/service-delivery/maintenance",
        },
        {
          title: "Projects",
          url: "#",
        },
      ],
    },
    {
      title: "Peace & Order",
      url: "/officials/peaceandorder",
      icon: ShieldAlert,
      items: [
        {
          title: "Apprehension",
          url: "/officials/peaceandorder/apprehension",
        },
        {
          title: "Case Management",
          url: "/officials/peaceandorder/case-management",
        },
        {
          title: "Disaster Logs",
          url: "/officials/peaceandorder/disaster-response",
        },
        {
          title: "Incidents",
          url: "/officials/peaceandorder/incidents",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
