"use client";

import { useState, Fragment } from "react";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useSelectedLayoutSegments } from "next/navigation";
import { logout } from "@/lib/actions";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
                        className="flex w-[85%] cursor-default justify-start hover:bg-transparent"
                        variant="ghost"
                      >
                        {isMouseOver ? (
                          <div className="flex space-x-3 text-primary">
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
                        className={`flex w-[85%] justify-start space-x-3`}
                        variant="ghost"
                      >
                        {isMouseOver ? (
                          <div
                            className="cursor-pointer"
                            onClick={() => router.push(`${element.Path}`)}
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
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={() => router.push(`${element.Path}`)}
                          >
                            <Icon
                              name={
                                isValidIconName(element.Icon)
                                  ? element.Icon
                                  : "MdOutlineNotInterested"
                              }
                              className="text-xl"
                            />
                          </div>
                        )}
                      </Button>
                    )}
                  </Fragment>
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex flex-col items-center space-y-3 py-3">
            {isMouseOver ? (
              <>
                {process.env.NEXT_PUBLIC_ENV === "test" && (
                  <div className="flex w-[85%] justify-start space-x-3 px-4">
                    {String(process.env.NEXT_PUBLIC_ENV)
                      .charAt(0)
                      .toUpperCase() +
                      String(process.env.NEXT_PUBLIC_ENV).slice(1)}
                  </div>
                )}
                <div className="flex w-[85%] justify-start space-x-3 px-4">
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
                  className="flex w-[85%] justify-start space-x-3"
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
                {process.env.NEXT_PUBLIC_ENV === "test" && (
                  <div>
                    {String(process.env.NEXT_PUBLIC_ENV)
                      .charAt(0)
                      .toUpperCase() +
                      String(process.env.NEXT_PUBLIC_ENV).slice(1)}
                  </div>
                )}
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
