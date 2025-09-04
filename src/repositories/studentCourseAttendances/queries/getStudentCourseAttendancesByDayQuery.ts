import { PrismaClient } from "@prisma/client";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import {
  StudentCourseAttendancesByDayViewModel,
  StudentCourseAttendancesByDay,
  StudentCourseAttendancesByDayMap,
} from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByDayQueryParams = {
  AttendanceDate: Date;
  PeriodNumber: number;
};

const getStudentCourseAttendancesByDayQuery = async (
  params: getStudentCourseAttendancesByDayQueryParams,
) => {
  const adjustedAttendanceDate = new Date(params.AttendanceDate);
  adjustedAttendanceDate.setHours(adjustedAttendanceDate.getHours() + 2);

  // Normalize AttendanceDate to get full day range
  const attendanceDateStart = new Date(adjustedAttendanceDate);
  attendanceDateStart.setUTCHours(0, 0, 0, 0);

  const attendanceDateEnd = new Date(attendanceDateStart);
  attendanceDateEnd.setUTCHours(23, 59, 59, 999);

  const activeScholarYear = await getActiveScholarYearQuery();

  const query = await prisma.studentCourseAttendances.findMany({
    where: {
      StudentCourses: {
        ScholarPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          Number: params.PeriodNumber,
        },
      },
      AttendanceDate: {
        gte: attendanceDateStart,
        lte: attendanceDateEnd,
      },
    },
    orderBy: [
      { AttendancePeriod: "asc" },
      { StudentCourses: { Courses: { Name: "asc" } } },
    ],
    include: {
      Users: {
        select: {
          UserId: true,
          UserName: true,
        },
      },
      StudentCourses: {
        include: {
          Courses: {
            select: {
              CourseId: true,
              Name: true,
              CourseCode: true,
              LevelCourses: {
                where: { Levels: { IsEnabled: true } },
                include: {
                  Levels: {
                    select: {
                      LevelId: true,
                      Name: true,
                    },
                  },
                },
                orderBy: {
                  Levels: { Name: "asc" },
                },
              },
            },
          },
        },
      },
    },
  });

  // Create a map to group by level
  const levelMap: Record<number, StudentCourseAttendancesByDayViewModel> = {};
  // Create a separate group for courses without levels
  let coursesWithoutLevel: StudentCourseAttendancesByDayViewModel | undefined =
    undefined;

  // Process each attendance record
  query.forEach((attendance: StudentCourseAttendancesByDayMap) => {
    const course = attendance.StudentCourses.Courses;

    // Create attendance entry
    const attendanceEntry: StudentCourseAttendancesByDay = {
      CourseId: course.CourseId,
      CourseName: course.Name,
      CourseCode: course.CourseCode,
      AttendanceDate: attendance.AttendanceDate,
      AttendancePeriod: attendance.AttendancePeriod,
      UserId: attendance.UserId,
      UserName: attendance.Users?.UserName || "",
    };

    // Check if course has levels
    if (course.LevelCourses.length === 0) {
      // Course has no levels - add to the "without level" group
      if (!coursesWithoutLevel) {
        coursesWithoutLevel = {
          LevelName: "Cours optionneles",
          LevelCourses: [],
          Attendances: [],
        };
      }

      // Check for duplicates in courses without level
      const existingEntry = coursesWithoutLevel.Attendances.find(
        (att) =>
          att.CourseId === attendanceEntry.CourseId &&
          att.AttendancePeriod === attendanceEntry.AttendancePeriod &&
          att.UserId === attendanceEntry.UserId,
      );

      if (!existingEntry) {
        coursesWithoutLevel.Attendances.push(attendanceEntry);
      }
    } else {
      // Process each level that this course belongs to
      course.LevelCourses.forEach((levelCourse) => {
        const level = levelCourse.Levels;
        const levelId = level.LevelId;

        // Initialize level group if it doesn't exist
        if (!levelMap[levelId]) {
          levelMap[levelId] = {
            LevelName: level.Name,
            LevelCourses: course.LevelCourses.map((lc) => ({
              Level: lc.Levels.Name,
            })),
            Attendances: [],
          };
        }

        // Check if this attendance entry already exists for this level
        // (to avoid duplicates when a course belongs to multiple levels)
        const existingEntry = levelMap[levelId].Attendances.find(
          (att) =>
            att.CourseId === attendanceEntry.CourseId &&
            att.AttendancePeriod === attendanceEntry.AttendancePeriod &&
            att.UserId === attendanceEntry.UserId,
        );

        if (!existingEntry) {
          levelMap[levelId].Attendances.push(attendanceEntry);
        }
      });
    }
  });

  // Convert map to array and sort by level name
  const result = Object.values(levelMap).sort((a, b) =>
    a.LevelName.localeCompare(b.LevelName),
  );

  if (coursesWithoutLevel) {
    result.push(coursesWithoutLevel);
  }

  return result;
};

export default getStudentCourseAttendancesByDayQuery;
