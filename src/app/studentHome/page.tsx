import StudentInfo from "@/components/studentProfile/studentInfo";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import getAllModuleElementsByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModuleElementsByRoleIdQuery";
import getStudentProfileDataQuery from "@/repositories/students/queries/getStudentProfileDataQuery";
import getAllCountriesQuery from "@/repositories/countries/queries/getAllCountriesQuery";
import { ModuleElementsViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { StudentViewModel } from "@/repositories/students/studentsViewModel";
import { CountryViewModel } from "@/repositories/countries/countriesViewModel";
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
  let student: StudentViewModel | null = null;
  let countries: CountryViewModel[] = [];

  if (session) {
    moduleElements = await getAllModuleElementsByRoleIdQuery(
      session.user.userData.RoleId,
      modules.find((x) => x.Path === "/studentHome")?.ModuleId || 0,
    );
    countries = await getAllCountriesQuery();
  }

  if (session && session.user.userData.StudentId !== null) {
    student = await getStudentProfileDataQuery(session.user.userData.StudentId);
  }

  return (
    <main className="mt-6 w-full">
      {/* Desktop */}
      <div className="hidden sm:flex sm:justify-center">
        <div className="mt-3 w-[70vw]">
          <Button
            asChild
            className={`absolute -left-16 -top-1`}
            variant="ghost"
          >
            <Link href={`/studentHome`}>
              <Icon name={"MdArrowBack"} className="text-xl" />
            </Link>
          </Button>

          <StudentInfo
            student={student}
            countries={countries}
            userId={session && session.user.userData.UserId}
          />

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
      </div>
      {/* Mobile */}
      <div className="flex justify-center sm:hidden">
        <div className="mt-3 w-[92vw]">
          <StudentInfo
            student={student}
            countries={countries}
            userId={session && session.user.userData.UserId}
          />
          <div
            className={`-ml-8 mt-4 flex flex-wrap justify-center space-x-8 space-y-8`}
          >
            <div />
            {moduleElements
              .filter((x) => x.ModuleElementId !== 0)
              .map((element, index) => (
                <Button
                  key={index}
                  asChild
                  className={`h-[6rem] w-[6rem]`}
                  variant="outline"
                >
                  <Link href={`${element.Path}`} className="flex flex-col">
                    <Icon
                      name={
                        isValidIconName(element.Icon)
                          ? element.Icon
                          : "MdOutlineNotInterested"
                      }
                      className="flex h-[50%] items-end text-2xl"
                    />
                    <span className="h-[50%] text-wrap text-center">
                      {element.Name}
                    </span>
                  </Link>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
