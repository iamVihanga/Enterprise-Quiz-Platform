import React from "react";

type Props = {
  title: string;
  description: string;
  actionComponent: React.ReactNode;
};

export function AppPageShell({ actionComponent, description, title }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {actionComponent}
    </div>
  );
}
