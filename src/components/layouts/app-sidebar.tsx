"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CircleDollarSignIcon,
  Command,
  DollarSignIcon,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  UserCog2Icon,
} from "lucide-react";

import { NavMain } from "@/components/layouts/nav-main";
import { NavProjects } from "@/components/layouts/nav-projects";
import { NavUser } from "@/components/layouts/nav-user";
import { TeamSwitcher } from "@/components/layouts/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { type Session } from "@/lib/auth";
import { NavAdmins } from "./nav-admin";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
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
          url: "/dashboard/billing",
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
  admin: [
    {
      name: "User Management",
      url: "/dashboard/manage-users",
      icon: UserCog2Icon,
    },
    {
      name: "Subscription Plans",
      url: "/dashboard/manage-plans",
      icon: DollarSignIcon,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {props.session.user.role === "admin" && (
          <NavAdmins adminLinks={data.admin} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: props.session.user.email,
            avatar: props.session.user.image ?? "",
            name: props.session.user.name,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
