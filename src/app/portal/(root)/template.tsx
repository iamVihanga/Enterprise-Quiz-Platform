import React from "react";
import { PortalNavBar } from "@/features/portal/components/nav-bar";
import { ProfileCard } from "@/features/portal/components/profile-card";
import { QuickLinks } from "@/features/portal/components/quick-links";
import { PortalClassSwitcher } from "@/features/portal/components/class-switcher";

type Props = {
  children: React.ReactNode;
};

export default async function PortalHomeTemplate({ children }: Props) {
  return (
    <div className="bg-secondary/50 dark:bg-secondary/10 min-h-screen">
      <PortalNavBar />

      <div className="max-w-screen-xl mx-auto py-6 grid grid-cols-4 gap-5 relative">
        <div className="space-y-4 h-full">
          <ProfileCard />

          <div className="sticky top-5 space-y-4">
            <PortalClassSwitcher refetch />

            <QuickLinks />
          </div>
        </div>

        <div className="col-span-3">{children}</div>
      </div>
    </div>
  );
}
