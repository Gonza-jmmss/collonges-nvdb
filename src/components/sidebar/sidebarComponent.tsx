"use client";

import { useState, Fragment } from "react";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useSelectedLayoutSegments } from "next/navigation";
import { logout } from "@/lib/actions";
import frFR from "@/lang/fr-FR";
import { Session } from "next-auth";

export default function Sidebar({
  children,
  modules,
  session,
}: {
  children: React.ReactNode;
  modules: ModulesViewModel[];
  session: Session | null;
}) {
  const t = frFR;
  const segments = useSelectedLayoutSegments();

  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div className="relative flex">
      <aside
        className={`h-full min-h-[95vh] border-r ${isMouseOver ? "w-48" : "w-16"} fixed z-40 bg-background duration-300`}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className={`flex flex-col items-center space-y-3 py-3`}>
            {modules.map((element, index) => (
              <Fragment key={index}>
                {element.ModuleId !== 0 && (
                  <Fragment key={index}>
                    {(element.Path.slice(1) === ""
                      ? "home"
                      : element.Path.slice(1)) ===
                    (segments.length === 0
                      ? "home"
                      : segments[0].toLowerCase()) ? (
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
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-2 pb-5">
            {isMouseOver ? (
              <>
                <div className="flex w-[85%] justify-center space-x-3">
                  <Icon
                    name={
                      isValidIconName("MdPersonOutline")
                        ? "MdPersonOutline"
                        : "MdOutlineNotInterested"
                    }
                    className="text-xl"
                  />
                  <span>{session?.user.name}</span>
                </div>
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
              </>
            ) : (
              <>
                <Icon
                  name={
                    isValidIconName("MdPersonOutline")
                      ? "MdPersonOutline"
                      : "MdOutlineNotInterested"
                  }
                  className="text-xl"
                />
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
              </>
            )}
          </div>
        </div>
      </aside>
      <div className={`ml-16 w-full px-10`}>{children}</div>
    </div>
  );
}
