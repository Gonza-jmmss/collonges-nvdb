import StudentCoursesTable from "./studentCoursesTable";
import getAllStudentCoursesQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesQuery";
import frFR from "@/lang/fr-FR";

export default async function StudentsCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const studentCourses = await getAllStudentCoursesQuery();

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.studentCourses.title}
          </span>
        </div>
        <StudentCoursesTable
          studentCoursesData={studentCourses}
          urlParams={searchParams}
        />
        {/* <pre>{JSON.stringify(studentCourses, null, 2)}</pre> */}
      </div>
    </main>
  );
}
