import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import frFR from "@/lang/fr-FR";

export default function Settings() {
  const t = frFR;
  return (
    <main className="mt-6 flex w-full justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-center">
          <span className="text-4xl font-bold">
            {t.SidebarElements.settings}
          </span>
        </div>
        <div className={`mt-10 flex justify-center space-x-8`}>
          {/* {sidebarElements.map((element, index) => (
            <Button
              key={index}
              asChild
              className={`h-[10rem] w-[10rem]`}
              variant="outline"
            >
              <Link
                href={`${element.path}`}
                className="flex flex-col space-y-2"
              >
                <Icon
                  name={
                    isValidIconName(element.icon)
                      ? element.icon
                      : "MdOutlineNotInterested"
                  }
                  className="text-3xl"
                />
                <span className="text-lg">{element.name}</span>
              </Link>
            </Button>
          ))} */}
          <Button asChild className={`h-[10rem] w-[10rem]`} variant="outline">
            <Link href={`/settings/users`} className="flex flex-col space-y-2">
              <Icon
                name={
                  isValidIconName("MdPerson")
                    ? "MdPerson"
                    : "MdOutlineNotInterested"
                }
                className="text-3xl"
              />
              <span className="text-lg">{t.users.title}</span>
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
                className="text-3xl"
              />
              <span className="text-lg">{t.roles.title}</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
