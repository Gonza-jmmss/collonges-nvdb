"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ThemeToggle from "./common/themeToggle";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import frFR from "@/lang/fr-FR";

export default function Breadcrumbs({ session }: { session: Session | null }) {
  const t = frFR;
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const breadcrumbElements = ["home"].concat(segments);

  const userRoleName = session?.user.userData.Roles.Name;

  return (
    <div className="flex w-full items-center justify-between sm:mt-3">
      {userRoleName === "Étudiant" ? (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbElements
                .slice(1)
                .map((segment: string, index: number) => (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      {index === breadcrumbElements.length - 2 ? (
                        <BreadcrumbPage
                          className={`cursor-default text-primary`}
                        >
                          {`${
                            isNaN(Number(segment))
                              ? t.breadcrumbs[
                                  segment as keyof typeof t.breadcrumbs
                                ] !== undefined
                                ? t.breadcrumbs[
                                    segment as keyof typeof t.breadcrumbs
                                  ]
                                : t.shared.page
                              : segment
                          }`}
                        </BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink
                            onClick={() =>
                              router.push(
                                `/${breadcrumbElements.slice(1, index + 1).join("/")}`,
                              )
                            }
                            className="cursor-pointer"
                            // href={`/${breadcrumbElements.slice(1, index + 1).join("/")}`}
                          >
                            {`${isNaN(Number(segment)) ? t.breadcrumbs[segment as keyof typeof t.breadcrumbs] : segment}`}
                          </BreadcrumbLink>
                        </>
                      )}
                    </BreadcrumbItem>

                    {index !== breadcrumbElements.length - 2 && (
                      <BreadcrumbSeparator />
                    )}
                  </Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      ) : (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbElements.map((segment: string, index: number) => (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    {index === breadcrumbElements.length - 1 ? (
                      <BreadcrumbPage className={`cursor-default text-primary`}>
                        {`${
                          isNaN(Number(segment))
                            ? t.breadcrumbs[
                                segment as keyof typeof t.breadcrumbs
                              ] !== undefined
                              ? t.breadcrumbs[
                                  segment as keyof typeof t.breadcrumbs
                                ]
                              : t.shared.page
                            : segment
                        }`}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink
                          onClick={() =>
                            router.push(
                              `/${breadcrumbElements.slice(1, index + 1).join("/")}`,
                            )
                          }
                          className="cursor-pointer"
                          // href={`/${breadcrumbElements.slice(1, index + 1).join("/")}`}
                        >
                          {`${isNaN(Number(segment)) ? t.breadcrumbs[segment as keyof typeof t.breadcrumbs] : segment}`}
                        </BreadcrumbLink>
                      </>
                    )}
                  </BreadcrumbItem>

                  {index !== breadcrumbElements.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <ThemeToggle />
    </div>
  );
}
