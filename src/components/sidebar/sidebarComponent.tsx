"use client";

import { useState, Fragment } from "react";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { ShortcutRoleModuleElementsViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import { ModuleElementsByModelIdViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useSelectedLayoutSegments } from "next/navigation";
import { logout } from "@/lib/actions";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";
import { Session } from "next-auth";

import ChangePassword from "@/components/studentProfile/changePassword";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Sidebar({
  children,
  modules,
  studentModuleElements,
  session,
  shortcuts,
}: {
  children: React.ReactNode;
  modules: ModulesViewModel[];
  studentModuleElements: ModuleElementsByModelIdViewModel[];
  session: Session | null;
  shortcuts: ShortcutRoleModuleElementsViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const segments = useSelectedLayoutSegments();

  const [isMouseOver, setIsMouseOver] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const userRoleName = session?.user.userData.Roles.Name;

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:relative sm:flex">
        <aside
          className={`h-full min-h-[95vh] border-r ${isMouseOver ? "w-48" : "w-16"} fixed z-40 overflow-y-auto overflow-x-hidden bg-background duration-300`}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        >
          <div className="flex h-full flex-col justify-between">
            <div className={`mt-1 flex flex-col items-center space-y-2 py-2`}>
              {userRoleName === "Étudiant" ? (
                <>
                  <Button
                    asChild
                    className={`flex w-[85%] justify-start space-x-2`}
                    variant="ghost"
                  >
                    {isMouseOver ? (
                      <div
                        className={`flex cursor-pointer space-x-2 ${segments.length === 1 ? "text-primary" : ""}`}
                        onClick={() => router.push(`/studentHome`)}
                      >
                        <Icon name={"MdHome"} className="text-xl" />
                        <span>{t.breadcrumbs.home}</span>
                      </div>
                    ) : (
                      <Icon
                        name={"MdHome"}
                        className={`text-xl ${segments.length === 1 ? "text-primary" : ""}`}
                      />
                    )}
                  </Button>
                  {studentModuleElements.map((element, index) => (
                    <Fragment key={index}>
                      {element.ModuleElementId !== 0 && (
                        <Fragment key={index}>
                          {segments.length === 2 &&
                          element.Path.slice(1).split("/")[1] ===
                            segments[1].toLowerCase() ? (
                            <Button
                              key={index}
                              className="flex w-[85%] cursor-default justify-start"
                              variant="ghost"
                            >
                              {isMouseOver ? (
                                <div
                                  className="flex cursor-pointer space-x-2 text-primary"
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
                              className={`flex w-[85%] justify-start space-x-2`}
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
                                  // onClick={() => router.push(`${element.Path}`)}
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
                </>
              ) : (
                <>
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
                              className="flex w-[85%] cursor-default justify-start"
                              variant="ghost"
                            >
                              {isMouseOver ? (
                                <div
                                  className="flex cursor-pointer space-x-2 text-primary"
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
                              className={`flex w-[85%] justify-start space-x-2`}
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
                                  // onClick={() => router.push(`${element.Path}`)}
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
                  <div className="flex w-full items-center space-x-2 px-2">
                    {isMouseOver ? (
                      <>
                        <div className="w-full border-b" />
                        <div className="text-sm font-semibold text-foreground/50">
                          {t.shared.shortcut}
                        </div>
                        <div className="w-full border-b" />
                      </>
                    ) : (
                      <div className="w-full border-b" />
                      // <>
                      //   <div className="w-full border-b" />
                      //   <Icon name={"MdOutlineShortcut"} className="text-sm" />
                      //   <div className="w-full border-b" />
                      // </>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-center space-y-1 py-1">
                    {shortcuts.map((element, index) => (
                      <Fragment key={index}>
                        {segments.length >= 2 &&
                        element.Path?.split("/")[2].toLowerCase() ===
                          segments[1].toLowerCase() ? (
                          <Button
                            key={index}
                            className="flex w-[90%] cursor-default justify-start"
                            variant="ghost"
                          >
                            {isMouseOver ? (
                              <div
                                className="flex cursor-pointer items-center space-x-2 text-primary"
                                onClick={() => router.push(`${element.Path}`)}
                              >
                                <Icon
                                  name={
                                    isValidIconName(element.Icon)
                                      ? element.Icon
                                      : "MdOutlineNotInterested"
                                  }
                                  className="text-lg"
                                />
                                <span className="text-xs">{element.Name}</span>
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
                            className={`flex w-[90%] justify-start space-x-2`}
                            variant="ghost"
                          >
                            {isMouseOver ? (
                              <div
                                className="flex cursor-pointer items-center"
                                onClick={() => router.push(`${element.Path}`)}
                              >
                                <Icon
                                  name={
                                    isValidIconName(element.Icon)
                                      ? element.Icon
                                      : "MdOutlineNotInterested"
                                  }
                                  className="text-lg"
                                />
                                <span className="text-xs">{element.Name}</span>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer"
                                // onClick={() => router.push(`${element.Path}`)}
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
                    ))}
                  </div>
                </>
              )}
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
                  <Button
                    variant={"ghost"}
                    className="flex w-[85%] cursor-pointer items-center justify-start space-x-3 px-4"
                    // onClick={() => router.push(`/changePassword`)}
                    onClick={() => setOpenModal(true)}
                  >
                    <Icon name={"MdPersonOutline"} className="text-xl" />
                    <span>{session?.user.name}</span>
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="flex w-[85%] justify-start space-x-3"
                    onClick={() => logout()}
                  >
                    <Icon name={"MdLogout"} className="text-xl" />
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
                  <Icon name={"MdPersonOutline"} className="text-xl" />
                  <Button variant={"ghost"} onClick={() => logout()}>
                    <Icon name={"MdLogout"} className="text-xl" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </aside>
        <div className={`ml-16 w-full px-10`}>{children}</div>
      </div>
      {/* Mobile */}
      <div className="relative sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <Icon name={"MdMenu"} className="text-xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border bg-background">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div
                  className="flex space-x-3"
                  onClick={() => router.push(`/studentHome`)}
                >
                  <Icon name={"MdSchool"} className="text-xl" />
                  <span>{t.breadcrumbs.home}</span>
                </div>
              </DropdownMenuItem>
              {studentModuleElements.map((element, index) => (
                <DropdownMenuItem key={index}>
                  <div
                    className="flex space-x-3"
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
                    <span>{element.Name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="flex space-x-3"
                  onClick={() => router.push(`/changePassword`)}
                >
                  <Icon name={"MdPassword"} className="text-xl" />
                  <span>{t.shared.changePassword.title}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex space-x-3">
                  <Icon name={"MdPersonOutline"} className="text-xl" />
                  <span>{session?.user.name}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex space-x-3" onClick={() => logout()}>
                  <Icon name={"MdLogout"} className="text-xl" />
                  <span>{t.shared.logout}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className={`w-full px-4`}>{children}</div>
      </div>
      {session !== null && (
        <ChangePassword
          openModal={openModal}
          closeModal={closeModal}
          userId={session.user.userData.UserId}
        />
      )}
    </>
  );
}
