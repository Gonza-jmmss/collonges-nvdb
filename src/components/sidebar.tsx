"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useSelectedLayoutSegments } from "next/navigation";
import ThemeToggler from "@/components/common/themeToggler";
import frFR from "@/lang/fr-FR";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const t = frFR;
  const segments = useSelectedLayoutSegments();

  const [isMouseOver, setIsMouseOver] = useState(false);

  const sidebarElements = [
    {
      name: t.SidebarElements.home,
      segmentName: t.SidebarElements.homeSegment,
      path: "/",
      icon: "MdHome",
    },
    {
      name: t.SidebarElements.students,
      segmentName: t.SidebarElements.studentsSegment,
      path: "/students",
      icon: "MdSchool",
    },
    {
      name: t.SidebarElements.reports,
      segmentName: t.SidebarElements.reportsSegment,
      path: "/reports",
      icon: "MdDvr",
    },
  ];

  return (
    <div className="relative flex">
      <aside
        className={`h-full min-h-[95vh] border-r ${isMouseOver ? "w-48" : "w-16"} fixed z-50 bg-background duration-300`}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className={`flex flex-col items-center space-y-3 py-3`}>
            {sidebarElements.map((element, index) => (
              <>
                {element.segmentName.toLowerCase() ===
                (segments.length === 0 ? "home" : segments[0].toLowerCase()) ? (
                  <Button
                    key={index}
                    className="w-[85%] cursor-default duration-300 hover:bg-transparent"
                    variant="ghost"
                  >
                    {isMouseOver ? (
                      <div className="flex justify-center space-x-3 text-primary">
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
                        className="text-xl text-primary"
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
          <div className="flex w-full justify-center pb-5">
            <ThemeToggler />
          </div>
        </div>
      </aside>
      <div className={`ml-16 w-full px-10`}>{children}</div>
    </div>
  );
}
