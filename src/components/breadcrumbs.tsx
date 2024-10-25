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

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();
  const breadcrumbElements = ["home"].concat(segments);
  console.log("segments", segments.map((x) => `/${x}`))

  return (
    <div className="w-full mt-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbElements.map((segment, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {index === breadcrumbElements.length - 1 ? (
                  <BreadcrumbPage>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink
                      href={`${index === 0 ? "/" : segments.map((x) => `/${x}`)}`}
                    >
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>

              {index !== breadcrumbElements.length - 1 && (
                <>
                  <BreadcrumbSeparator />
                </>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
