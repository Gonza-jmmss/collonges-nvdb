"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeToggler = () => {
  const { setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkTheme(isDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      className="flex justify-center"
      variant={"ghost"}
      onClick={toggleTheme}
    >
      {isDarkTheme ? (
        <Icon name="MdSunny" className="text-2xl" />
      ) : (
        <Icon name="MdDarkMode" className="text-2xl" />
      )}
    </Button>
  );
};

export default ThemeToggler;
