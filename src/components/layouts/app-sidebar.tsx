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
  ShieldIcon,
  UserCog2Icon,
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
import { ScrollArea } from "../ui/scroll-area";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
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
      {
        name: "Admins",
        url: "/dashboard/admins",
        icon: ShieldIcon,
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
    getSettings: (isAdmin: boolean) => [
      ...(isAdmin
        ? [
            {
              title: "User Management",
              url: "/dashboard/user-management",
              icon: UserCog2Icon,
            },
          ]
        : []),
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "/dashboard/settings",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ClassSwitcher />
      </SidebarHeader>

      <ScrollArea className="flex-1">
        <SidebarContent>
          <NavMain items={data.navMain} />

          {props.session.user.role === "admin" && (
            <NavClassManagement cmLinks={data.classManagement} />
          )}

          <NavContent items={data.content} />

          <NavSettings
            items={data.getSettings(props.session.user.role === "admin")}
          />
        </SidebarContent>
      </ScrollArea>

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
