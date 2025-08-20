import StudentTextBooksTabs from "./textbooksTabs";
import getStudentCourseContentsByDayQuery from "@/repositories/courseTextbook/queries/getStudentCourseContentsByDayQuery";
import getStudentCourseHomeworksByDayQuery from "@/repositories/courseTextbook/queries/getStudentCourseHomeworksByDayQuery";
import getStudentHomeworkAmountsByTwoWeeks from "@/repositories/courseTextbook/queries/getStudentHomeworkAmountsByTwoWeeks";
import {
  CourseContentsViewModel,
  StudentCourseHomeworksByDayViewModel,
  StudentHomeworkAmountsByTwoWeeksViewModel,
} from "@/repositories/courseTextbook/courseTextbookViewModel";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";
import { auth } from "@/utils/auth";

export default async function StudentTextbooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const textbookDateParam = searchParams.textbookDate
    ? new Date(searchParams.textbookDate as string)
    : new Date();

  let courseContents: CourseContentsViewModel[] = [];
  let studentHomework: StudentCourseHomeworksByDayViewModel[] = [];
  let homeworksByTowWeeks: StudentHomeworkAmountsByTwoWeeksViewModel[] = [];

  if (session && session.user.userData.StudentId !== null) {
    courseContents = await getStudentCourseContentsByDayQuery({
      StudentId: session.user.userData.StudentId,
      TextbookDate: textbookDateParam,
    });
    studentHomework = await getStudentCourseHomeworksByDayQuery({
      StudentId: session.user.userData.StudentId,
      TextbookDate: textbookDateParam,
    });
    homeworksByTowWeeks = await getStudentHomeworkAmountsByTwoWeeks({
      StudentId: session.user.userData.StudentId,
      TextbookDate: new Date(),
    });
  }

  return (
    <main className="relative mt-3 w-[92vw] sm:w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/studentHome`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <StudentTextBooksTabs
        courseTextbooksData={courseContents}
        courseHomeworksData={studentHomework}
        textbookDateSelected={textbookDateParam}
        homeworksByTowWeeks={homeworksByTowWeeks}
        tab={searchParams?.tab}
      />
      {/* <div>
        <StudentCourses courses={courses} />
      </div> */}
      {/* <pre>{JSON.stringify(courseContents, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(studentHomework, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(homeworksByTowWeeks, null, 2)}</pre> */}
    </main>
  );
}
