"use client";

import * as React from "react";
import { useEffect } from "react";
import Icon from "@/components/common/icon";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ThemeToggler = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <>
      {localStorage.getItem("theme") === "dark" ? (
        <Button
          className="flex justify-center"
          variant={"ghost"}
          onClick={() => setTheme("light")}
        >
          <Icon name="MdSunny" className="text-2xl" />
        </Button>
      ) : (
        <Button
          className="flex justify-center"
          variant={"ghost"}
          onClick={() => setTheme("dark")}
        >
          <Icon name="MdDarkMode" className="text-2xl" />
        </Button>
      )}
    </>
  );
};

export default ThemeToggler;
