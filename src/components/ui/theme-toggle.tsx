"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./button";
import { MoonIcon, SunIcon } from "lucide-react";

type Props = {};

export default function ThemeToggle({}: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="w-full"
      variant={"outline"}
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      {theme === "dark" ? (
        <>
          <SunIcon className="size-4" />
          Light Mode
        </>
      ) : (
        <>
          <MoonIcon className="size-4" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
