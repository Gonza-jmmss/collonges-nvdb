"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import { usePathname } from "next/navigation";
import isValidIconName from "@/functions/isValidIconName";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isMouseOver, setIsMouseOver] = useState(false);

  const sidebarElements = [
    { name: "Home", path: "/", icon: "MdHome" },
    { name: "Students", path: "/students", icon: "MdSchool" },
    { name: "Reports", path: "/reports", icon: "MdDvr" },
  ];

  return (
    <div className="relative flex">
      <aside
        className={`h-full min-h-[95vh] border-r ${isMouseOver ? "w-48" : "w-16"} fixed z-50 bg-background duration-300`}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div className={`flex flex-col items-center space-y-3 py-3`}>
          {sidebarElements.map((element, index) => (
            <>
              {element.path === pathname ? (
                <Button
                  key={index}
                  className="w-[85%] cursor-default bg-accent duration-300"
                  variant="ghost"
                >
                  {isMouseOver ? (
                    <div className="flex justify-center space-x-3">
                      <Icon
                        name={
                          isValidIconName(element.icon)
                            ? element.icon
                            : "MdOutlineNotInterested"
                        }
                        className="text-xl"
                      />
                      <span>{element.name}</span>
                    </div>
                  ) : (
                    <Icon
                      name={
                        isValidIconName(element.icon)
                          ? element.icon
                          : "MdOutlineNotInterested"
                      }
                      className="text-xl"
                    />
                  )}
                </Button>
              ) : (
                <Button
                  key={index}
                  asChild
                  className={`w-[85%]`}
                  variant="ghost"
                >
                  {isMouseOver ? (
                    <Link
                      href={`${element.path}`}
                      className="flex justify-center space-x-3"
                    >
                      <Icon
                        name={
                          isValidIconName(element.icon)
                            ? element.icon
                            : "MdOutlineNotInterested"
                        }
                        className="text-xl"
                      />{" "}
                      <span>{element.name}</span>
                    </Link>
                  ) : (
                    <Link href={`${element.path}`}>
                      {
                        <Icon
                          name={
                            isValidIconName(element.icon)
                              ? element.icon
                              : "MdOutlineNotInterested"
                          }
                          className="text-xl"
                        />
                      }
                    </Link>
                  )}
                </Button>
              )}
            </>
          ))}
        </div>
      </aside>
      <div className={`ml-16 w-full px-10`}>{children}</div>
    </div>
  );
}
