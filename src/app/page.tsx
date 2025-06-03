import getAllModulesByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModulesByRoleIdQuery";
import getShortcutRoleModuleElementsByRoleQuery from "@/repositories/roleModuleElements/queries/getShortcutRoleModuleElementsByRoleQuery";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { ShortcutRoleModuleElementsViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import frFR from "@/lang/fr-FR";
import { auth } from "@/utils/auth";

import StudentProfile from "@/components/studentProfile/studentProfile";
import getStudentProfileDataQuery from "@/repositories/students/queries/getStudentProfileDataQuery";
import getAllCountriesQuery from "@/repositories/countries/queries/getAllCountriesQuery";
import getStudentCourseGradeByStudentIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradeByStudentIdQuery";
import { StudentViewModel } from "@/repositories/students/studentsViewModel";
import { CountryViewModel } from "@/repositories/countries/countriesViewModel";
import { StudentCourseGradesByStudentIdViewModel } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";

export default async function Home() {
  const t = frFR;
  const session = await auth();

  const userRoleName = session?.user.userData.Roles.Name;

  let modules: ModulesViewModel[] = [];
  let shortcuts: ShortcutRoleModuleElementsViewModel[] = [];

  if (session) {
    modules = await getAllModulesByRoleIdQuery(session.user.userData.RoleId);
    shortcuts = await getShortcutRoleModuleElementsByRoleQuery({
      RoleId: session.user.userData.RoleId,
    });
  }

  // const shortcuts = getShortcutRoleModuleElementsByRoleQuery()

  let student: StudentViewModel | null = null;
  let countries: CountryViewModel[] = [];
  let courses: StudentCourseGradesByStudentIdViewModel[] = [];

  if (
    userRoleName === "Étudiant" &&
    session &&
    session.user.userData.StudentId !== null
  ) {
    student = await getStudentProfileDataQuery(session.user.userData.StudentId);
    countries = await getAllCountriesQuery();
    courses = await getStudentCourseGradeByStudentIdQuery({
      StudentId: session.user.userData.StudentId,
    });
  }

  return (
    <>
      {userRoleName !== "Étudiant" ? (
        <main className="mt-6 flex w-full justify-center">
          <div className="mt-3 w-[80vw]">
            <div className="flex justify-center">
              <span className="text-4xl font-bold">{t.shared.welcome}</span>
            </div>
            {/* <div className={`mt-10 flex justify-center space-x-8`}> */}
            <div
              className={`-ml-8 mt-10 flex flex-wrap justify-center space-x-8 space-y-8`}
            >
              <div />
              {modules.slice(1).map((element, index) => (
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
            </div>
            <div className="mt-10 flex w-full items-center space-x-3">
              <div className="w-full border-b" />
              <div className="text-lg font-semibold">{t.shared.shortcut}</div>
              <div className="w-full border-b" />
            </div>
            <div
              className={`-ml-8 flex flex-wrap justify-center space-x-8 space-y-8`}
            >
              <div />
              {shortcuts.map((element, index) => (
                <Button
                  key={index}
                  asChild
                  className={`h-[4rem] w-[12rem]`}
                  variant="outline"
                >
                  <Link href={`${element.Path}`} className="flex space-x-2">
                    {/* <Icon name="MdSchool" className="text-2xl" />
                    <span className="text-base">{t.shortcuts.students}</span> */}
                    <Icon
                      name={
                        isValidIconName(element.Icon)
                          ? element.Icon
                          : "MdOutlineNotInterested"
                      }
                      className="text-2xl"
                    />
                    <span className="text-base">{element.Name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="mt-6 flex w-full justify-center">
          <div className="mt-3 w-[92vw] sm:w-[80vw]">
            <StudentProfile
              student={student}
              countries={countries}
              courses={courses}
              userId={session && session.user.userData.UserId}
            />
            {/* <pre>{JSON.stringify(courses, null, 2)}</pre> */}
          </div>
        </main>
      )}
    </>
  );
}
