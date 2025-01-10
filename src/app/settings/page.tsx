import getAllSidebarElementsQuery from "@/repositories/sidebarElements/queries/getAllSidebarElementsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import frFR from "@/lang/fr-FR";

export default async function Settings() {
  const t = frFR;

  const sidebarElements = await getAllSidebarElementsQuery();
  return (
    <main className="mt-6 flex w-full justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-center">
          <span className="text-4xl font-bold">
            {t.SidebarElements.settings}
          </span>
        </div>
        <div className={`mt-10 flex justify-center space-x-8`}>
          {sidebarElements.map((element, index) => (
            <Button
              key={index}
              asChild
              className={`h-[10rem] w-[10rem]`}
              variant="outline"
            >
              <Link
                href={`${element.Path}`}
                className="flex flex-col space-y-2"
              >
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
          {/* <Button asChild className={`h-[10rem] w-[10rem]`} variant="outline">
            <Link href={`/settings/users`} className="flex flex-col space-y-2">
              <Icon
                name={
                  isValidIconName("MdPerson")
                    ? "MdPerson"
                    : "MdOutlineNotInterested"
                }
                className="flex h-[50%] items-end text-3xl"
              />
              <span className="h-[50%] text-wrap text-center text-lg">
                {t.users.title}
              </span>
            </Link>
          </Button>
          <Button asChild className={`h-[10rem] w-[10rem]`} variant="outline">
            <Link href={`/settings/roles`} className="flex flex-col space-y-2">
              <Icon
                name={
                  isValidIconName("MdGppGood")
                    ? "MdGppGood"
                    : "MdOutlineNotInterested"
                }
                className="flex h-[50%] items-end text-3xl"
              />
              <span className="h-[50%] text-wrap text-center text-lg">
                {t.roles.title}
              </span>
            </Link>
          </Button>
          <Button asChild className={`h-[10rem] w-[10rem]`} variant="outline">
            <Link
              href={`/settings/modules`}
              className="flex flex-col space-y-2"
            >
              <Icon
                name={
                  isValidIconName("MdViewModule")
                    ? "MdViewModule"
                    : "MdOutlineNotInterested"
                }
                className="flex h-[50%] items-end text-3xl"
              />
              <span className="h-[50%] text-wrap text-center text-lg">
                {t.modules.title}
              </span>
            </Link>
          </Button>
          <Button asChild className={`h-[10rem] w-[10rem]`} variant="outline">
            <Link
              href={`/settings/sidebarElements`}
              className="flex flex-col space-y-2"
            >
              <Icon
                name={
                  isValidIconName("MdStop")
                    ? "MdStop"
                    : "MdOutlineNotInterested"
                }
                className="flex h-[50%] items-end text-3xl"
              />
              <span className="h-[50%] text-wrap text-center text-lg">
                {t.sidebarElements.surnom}
              </span>
            </Link>
          </Button> */}
        </div>
      </div>
    </main>
  );
}
