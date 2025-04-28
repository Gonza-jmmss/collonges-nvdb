import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import getAllModuleElementsByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModuleElementsByRoleIdQuery";
import { ModuleElementsViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function Settings() {
  const t = frFR;
  const session = await auth();

  const modules = await getAllModulesQuery();

  let moduleElements: ModuleElementsViewModel[] = [];

  if (session) {
    moduleElements = await getAllModuleElementsByRoleIdQuery(
      session.user.userData.RoleId,
      modules.find((x) => x.Path === "/courses")?.ModuleId || 0,
    );
  }

  return (
    <main className="mt-6 flex w-full justify-center">
      <div className="mt-3 w-[70vw]">
        <div className="flex justify-center">
          <span className="text-4xl font-bold">{t.breadcrumbs.courses}</span>
        </div>
        {/* <pre>{JSON.stringify(moduleElements, null, 2)}</pre> */}
        {/* <div className={`mt-10 grid grid-cols-5 justify-items-center gap-8`}> */}
        <div
          className={`-ml-8 mt-10 flex flex-wrap justify-center space-x-8 space-y-8`}
        >
          <div />
          {moduleElements
            .filter((x) => x.ModuleElementId !== 0)
            .map((element, index) => (
              <Button
                key={index}
                asChild
                className={`h-[10rem] w-[10rem]`}
                variant="outline"
              >
                <Link href={`${element.Path}`} className="flex flex-col">
                  <Icon
                    name={
                      isValidIconName(element.Icon)
                        ? element.Icon
                        : "MdOutlineNotInterested"
                    }
                    className="flex h-[50%] items-end text-3xl"
                  />
                  <span className="h-[50%] text-wrap text-center text-lg">
                    {element.Name}
                  </span>
                </Link>
              </Button>
            ))}
        </div>
      </div>
    </main>
  );
}
