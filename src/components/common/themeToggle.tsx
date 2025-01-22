"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <Button
      className="flex justify-center"
      variant="ghost"
      onClick={toggleTheme}
    >
      {resolvedTheme === "dark" ? (
        <Icon name="MdSunny" className="text-2xl" />
      ) : (
        <Icon name="MdDarkMode" className="text-2xl" />
      )}
    </Button>
  );
};

export default ThemeToggle;
