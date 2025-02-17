"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings2,
  GraduationCapIcon,
  UsersIcon,
  LayoutDashboard,
  BookOpenIcon,
  LibraryBigIcon,
  FileQuestionIcon,
} from "lucide-react";

import { NavMain } from "@/components/layouts/nav-groups/nav-main";
import { NavUser } from "@/components/layouts/nav-groups/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { type Session } from "@/lib/auth";
import { NavClassManagement } from "./nav-groups/nav-class-management";
import { NavContent } from "./nav-groups/nav-content";
import { NavSettings } from "./nav-groups/nav-settings";

import { ClassSwitcher } from "@/features/classes/components/class-switcher";

// This is sample data.
const data = {
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
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
  classManagement: [
    {
      name: "Classes",
      url: "/dashboard/classes",
      icon: GraduationCapIcon,
    },
    {
      name: "Students",
      url: "/dashboard/students",
      icon: UsersIcon,
    },
  ],
  content: [
    {
      title: "Lessons",
      url: "/dashboard/lessons",
      icon: BookOpenIcon,
    },
    {
      title: "Materials",
      url: "/dashboard/materials",
      icon: LibraryBigIcon,
    },
    {
      title: "Quizzes",
      url: "/dashboard/quizzes",
      icon: FileQuestionIcon,
    },
  ],
  settings: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "System",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ClassSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavClassManagement cmLinks={data.classManagement} />

        <NavContent items={data.content} />

        <NavSettings items={data.settings} />
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
