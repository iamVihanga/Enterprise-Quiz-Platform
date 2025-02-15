import React from "react";
import { Logo } from "@/components/app-logo";

type Props = {
  children: React.ReactNode;
};

export default function ResetPasswordLayout({ children }: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <Logo />

      {children}
    </div>
  );
}
