import { headers } from "next/headers";

import { NavUser } from "@/components/layouts/nav-groups/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { auth, type Session } from "@/lib/auth";

import { ClassSwitcher } from "@/features/classes/components/class-switcher";
import { ScrollArea } from "../ui/scroll-area";
import AppSidebarContent from "./app-sidebar-content";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ClassSwitcher />
      </SidebarHeader>

      <ScrollArea className="flex-1">
        <SidebarContent>
          <AppSidebarContent
            session={props.session}
            activeMember={activeMember}
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
