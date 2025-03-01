"use client";

import React, { useEffect, useTransition } from "react";
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

import { type Session } from "@/lib/auth";
import { NavMain } from "@/components/layouts/nav-groups/nav-main";
import { NavClassManagement } from "./nav-groups/nav-class-management";
import { NavContent } from "./nav-groups/nav-content";
import { NavSettings } from "./nav-groups/nav-settings";
import { authClient } from "@/features/auth/auth-client";
import { useRouter } from "next/navigation";

type Props = {
  activeMember: any;
  session: Session;
};

export default function AppSidebarContent({ activeMember, session }: Props) {
  const activeOrganization = authClient.useActiveOrganization();
  const router = useRouter();

  useEffect(() => {
    if (activeOrganization) router.refresh();
  }, [activeOrganization]);

  let data = {
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
        roles: ["admin", "owner"],
      },
      {
        name: "Admins",
        url: "/dashboard/admins",
        icon: ShieldIcon,
        roles: ["owner"],
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
    <>
      <NavMain items={data.navMain} />

      <NavClassManagement
        cmLinks={data.classManagement}
        activeMemberRole={activeMember?.role || null}
      />

      <NavContent items={data.content} />

      <NavSettings items={data.getSettings(session.user.role === "admin")} />
    </>
  );
}
