import TeacherCoursesTable from "./teacherCoursesTable";
import getAllTeracherCoursesQuery from "@/repositories/teacherCourses/queries/getAllTeacherCoursesQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function TeacherCoursesPage() {
  const t = frFR;

  const teacherCourses = await getAllTeracherCoursesQuery();

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.teacherCourses.title}</span>
      </div>
      <TeacherCoursesTable teacherCourses={teacherCourses} />
      {/* <pre>{JSON.stringify(teacherCourses, null, 2)}</pre> */}
    </main>
  );
}
