import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import frFR from "@/lang/fr-FR";

export default async function Home() {
  const t = frFR;

  const sidebarElements = [
    { name: t.SidebarElements.students, path: "/students", icon: "MdSchool" },
    { name: t.SidebarElements.reports, path: "/reports", icon: "MdDvr" },
  ];

  return (
    <main className="mt-6 flex w-full justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-center">
          <span className="text-4xl font-bold">{t.shared.welcome}</span>
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
          ))}
        </div>
      </div>
    </main>
  );
}
