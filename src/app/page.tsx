import getAllModulesByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModulesByRoleIdQuery";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
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

  if (session) {
    modules = await getAllModulesByRoleIdQuery(session.user.userData.RoleId);
  }

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
            {/* <pre>{JSON.stringify(modules, null, 2)}</pre> */}
            <div className={`mt-10 flex justify-center space-x-8`}>
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
            <div className={`mt-8 flex justify-center space-x-8`}>
              {userRoleName === "Professeur" || userRoleName === "Directeur" ? (
                <>
                  <Button
                    asChild
                    className={`h-[4rem] w-[10rem]`}
                    variant="outline"
                  >
                    <Link
                      href={`/students/students`}
                      className="flex space-x-2"
                    >
                      <Icon name="MdSchool" className="text-2xl" />
                      <span className="text-base">{t.shortcuts.students}</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className={`h-[4rem] w-[10rem]`}
                    variant="outline"
                  >
                    <Link
                      href={`/courses/studentCourseGrades`}
                      className="flex space-x-2"
                    >
                      <Icon name="MdRule" className="text-2xl" />
                      <span className="text-base">{t.shortcuts.grades}</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className={`h-[4rem] w-[10rem]`}
                    variant="outline"
                  >
                    <Link href={`/courses/courses`} className="flex space-x-2">
                      <Icon name="MdClass" className="text-2xl" />
                      <span className="text-base">{t.shortcuts.courses}</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className={`h-[4rem] w-[10rem]`}
                    variant="outline"
                  >
                    <Link
                      href={`/reports/ifleStudentsNotes`}
                      className="flex space-x-2"
                    >
                      <Icon name="MdDvr" className="text-2xl" />
                      <span className="text-base">
                        {t.shortcuts.transcripts}
                      </span>
                    </Link>
                  </Button>
                </>
              )}
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
