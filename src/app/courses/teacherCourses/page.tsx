import TeacherCoursesTable from "./teacherCoursesTable";
import getAllTeracherCoursesQuery from "@/repositories/teacherCourses/queries/getAllTeacherCoursesQuery";
import frFR from "@/lang/fr-FR";

export default async function TeacherCoursesPage() {
  const t = frFR;

  const teacherCourses = await getAllTeracherCoursesQuery();

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.teacherCourses.title}
          </span>
        </div>
        <TeacherCoursesTable teacherCourses={teacherCourses} />
        {/* <pre>{JSON.stringify(teacherCourses, null, 2)}</pre> */}
      </div>
    </main>
  );
}
