import StudentCourses from "@/components/studentProfile/studentCourses";
import getStudentCourseGradeByStudentIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradeByStudentIdQuery";
import { StudentCourseGradesByStudentIdViewModel } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";
import { auth } from "@/utils/auth";

export default async function StudentGradesPage() {
  const t = frFR;
  const session = await auth();

  let courses: StudentCourseGradesByStudentIdViewModel[] = [];

  if (session && session.user.userData.StudentId !== null) {
    courses = await getStudentCourseGradeByStudentIdQuery({
      StudentId: session.user.userData.StudentId,
    });
  }

  return (
    <main className="mt-3 w-[92vw] sm:w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/studentHome`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div>
        <StudentCourses courses={courses} />
      </div>
      {/* <pre>{JSON.stringify(courses, null, 2)}</pre> */}
    </main>
  );
}
