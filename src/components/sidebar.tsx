"use client";

import { useState, Fragment, useEffect } from "react";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import UserIcon from "@/components/sidebar/userIcon";
import isValidIconName from "@/functions/isValidIconName";
import { useSelectedLayoutSegments } from "next/navigation";
import { logout } from "@/lib/actions";
import frFR from "@/lang/fr-FR";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const t = frFR;
  const segments = useSelectedLayoutSegments();

  const [isMouseOver, setIsMouseOver] = useState(false);

  const [modules, setModules] = useState<ModulesViewModel[]>([]);

  // const sidebarElements = [
  //   {
  //     name: t.SidebarElements.home,
  //     segmentName: t.SidebarElements.homeSegment,
  //     path: "/",
  //     icon: "MdHome",
  //   },
  //   {
  //     name: t.SidebarElements.students,
  //     segmentName: t.SidebarElements.studentsSegment,
  //     path: "/students",
  //     icon: "MdSchool",
  //   },
  //   {
  //     name: t.SidebarElements.reports,
  //     segmentName: t.SidebarElements.reportsSegment,
  //     path: "/reports",
  //     icon: "MdDvr",
  //   },
  //   {
  //     name: t.SidebarElements.settings,
  //     segmentName: t.SidebarElements.settings,
  //     path: "/settings",
  //     icon: "MdSettings",
  //   },
  // ];

  const getModules = async () => {
    const query = await getAllModulesQuery();
    setModules(query);
  };

  useEffect(() => {
    getModules();
  }, []);

  return (
    <div className="relative flex">
      <aside
        className={`h-full min-h-[95vh] border-r ${isMouseOver ? "w-48" : "w-16"} fixed z-40 bg-background duration-300`}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div className="flex h-full flex-col justify-between">
          {/* <div className={`flex flex-col items-center space-y-3 py-3`}>
            {sidebarElements.map((element, index) => (
              <Fragment key={index}>
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
              </Fragment>
            ))}
          </div> */}
          {/* <div>
            {modules.map((element, index) => (
              <div key={index}>
                {(element.Path.slice(1) === "" ? "home" : element.Path.slice(1))}
              </div>
            ))}
          </div> */}
          <div className={`flex flex-col items-center space-y-3 py-3`}>
            {modules.map((element, index) => (
              <Fragment key={index}>
                {(element.Path.slice(1) === ""
                  ? "home"
                  : element.Path.slice(1)) ===
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
                            isValidIconName(element.Icon)
                              ? element.Icon
                              : "MdOutlineNotInterested"
                          }
                          className="text-xl"
                        />
                        <span>{element.Name}</span>
                      </div>
                    ) : (
                      <Icon
                        name={
                          isValidIconName(element.Icon)
                            ? element.Icon
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
                        href={`${element.Path}`}
                        className="flex justify-center space-x-3"
                      >
                        <Icon
                          name={
                            isValidIconName(element.Icon)
                              ? element.Icon
                              : "MdOutlineNotInterested"
                          }
                          className="text-xl"
                        />{" "}
                        <span>{element.Name}</span>
                      </Link>
                    ) : (
                      <Link href={`${element.Path}`}>
                        {
                          <Icon
                            name={
                              isValidIconName(element.Icon)
                                ? element.Icon
                                : "MdOutlineNotInterested"
                            }
                            className="text-xl"
                          />
                        }
                      </Link>
                    )}
                  </Button>
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-2 pb-5">
            <UserIcon isMouseOver={isMouseOver} />
            {isMouseOver ? (
              <Button
                variant={"ghost"}
                className="flex w-[85%] justify-center space-x-3"
                onClick={() => logout()}
              >
                <Icon
                  name={
                    isValidIconName("MdLogout")
                      ? "MdLogout"
                      : "MdOutlineNotInterested"
                  }
                  className="text-xl"
                />
                <span>{t.shared.logout}</span>
              </Button>
            ) : (
              <Button variant={"ghost"} onClick={() => logout()}>
                <Icon
                  name={
                    isValidIconName("MdLogout")
                      ? "MdLogout"
                      : "MdOutlineNotInterested"
                  }
                  className="text-xl"
                />
              </Button>
            )}
          </div>
        </div>
      </aside>
      <div className={`ml-16 w-full px-10`}>{children}</div>
    </div>
  );
}
