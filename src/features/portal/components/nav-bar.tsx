"use client";

import React from "react";
import Link from "next/link";

import { Logo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Brain, MoonIcon, SunIcon, TrophyIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { authClient } from "@/features/auth/auth-client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SignoutButton } from "@/features/auth/components/signout-button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Leaderboard",
    href: "/portal/leaderboard",
    description: "View the leaderboard to see how you rank against other users."
  },
  {
    title: "User Statistics",
    href: "/portal/stats",
    description:
      "View your personal statistics, including quiz scores and progress."
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description:
      "Manage your account settings, view your activity, and access your data."
  }
];

type Props = {};

export function PortalNavBar({}: Props) {
  const { theme, setTheme } = useTheme();
  const { data, error, isPending } = authClient.useSession();

  return (
    <div className="w-full bg-background">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto py-3">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Logo className="text-primary" />
            <Badge className="border-primary bg-primary/20 text-primary hover:text-white">
              Portal
            </Badge>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-secondary/10 border border-secondary/50">
                  Explore Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="flex items-center gap-2">
                            <Brain className="h-6 w-6 text-primary-foreground" />
                            <h2 className="text-lg font-light leading-none text-primary-foreground space-x-0.5">
                              Quiz<span className="font-bold">Portal</span>
                            </h2>
                          </div>
                          <p className="text-xs leading-tight text-primary-foreground/70 mt-2">
                            {`You can explore Quizzes & Lessons using following links.`}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/portal/quizzes" title="Quizzes">
                      {`View all quizzes and select one to start.`}
                    </ListItem>
                    <ListItem href="/portal/lessons" title="Lessons">
                      {`View all lessons from classes you've joined.`}
                    </ListItem>
                    <ListItem href="/portal/leaderboard" title="Leaderboard">
                      {`View the leaderboard to see how you rank against other users.`}
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="space-x-3 flex items-center">
          <TooltipProvider>
            <Tooltip delayDuration={1}>
              <TooltipTrigger asChild>
                <Button
                  icon={<TrophyIcon />}
                  size="icon"
                  asChild
                  variant="outline"
                  className="rounded-full"
                >
                  <Link href={`/portal/leaderboard`}></Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leaderboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            size="icon"
            variant={"outline"}
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>

          {isPending || !data ? (
            <Skeleton className="size-9 rounded-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage
                    src={data.user.image as string}
                    alt={data.user.name}
                  />
                  <AvatarFallback>{data.user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuItem asChild className="mt-2">
                  <SignoutButton className="w-full" variant={"secondary"} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
