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
import { Fragment } from "react";
import frFR from "@/lang/fr-FR";

export default function Breadcrumbs() {
  const t = frFR;
  const segments = useSelectedLayoutSegments();
  const breadcrumbElements = ["home"].concat(segments);
  console.log(
    "segments",
    segments.map((x) => `/${x}`),
  );

  return (
    <div className="mt-3 w-full">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbElements.map((segment: string, index: number) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {index === breadcrumbElements.length - 1 ? (
                  <BreadcrumbPage className={`text-primary`}>
                    {`${isNaN(Number(segment)) ? t.breadcrumbs[segment as keyof typeof t.breadcrumbs] : segment}`}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink
                      href={`/${breadcrumbElements.slice(1, index + 1).join("/")}`}
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
    </div>
  );
}
