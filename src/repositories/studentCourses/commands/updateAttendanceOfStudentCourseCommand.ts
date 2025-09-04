"use server";

import { PrismaClient } from "@prisma/client";
import getStudentCourseAttendancesByStudentCourseIdQuery from "@/repositories/studentCourseAttendances/queries/getStudentCourseAttendancesByStudentCourseIdQuery";
import { AttendanceValueEnum } from "@/enum/attendanceValueEnum";

const prisma = new PrismaClient();

type updateAttendanceOfStudentCourseCommandParams = {
  StudentCourseId: number;
  transactionClient?: any;
};

const updateAttendanceOfStudentCourseCommand = async (
  params: updateAttendanceOfStudentCourseCommandParams,
) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  // get the notes organized by coefficient
  const studentCourseAttendances =
    await getStudentCourseAttendancesByStudentCourseIdQuery({
      StudentCourseId: params.StudentCourseId,
      transactionClient: client,
    });

  // calculate attendanceScore
  const attendanceScore = calculateAttendanceScore(
    studentCourseAttendances?.Attendances,
  );

  const updateAttendanceOdStudentCourse = await client.studentCourses.update({
    where: { StudentCourseId: params.StudentCourseId },
    data: {
      AttendanceScore: attendanceScore,
    },
  });

  return updateAttendanceOdStudentCourse;
};

export default updateAttendanceOfStudentCourseCommand;

type studentCourseAttendancesType =
  | {
      AttendanceValue: number;
      AttendanceValueCount: number;
    }[]
  | undefined;

const calculateAttendanceScore = (
  studentCourseAttendances: studentCourseAttendancesType,
) => {
  console.log("calculateAttendanceScore", studentCourseAttendances);

  // présent (P) => 0
  // absent (A) => 1
  // retard (R) => 3 retard = 1
  // excusé (EX) => 0

  //   export enum attendanceValueEnum {
  //   "Présent", => 0
  //   "Absent", => 1
  //   "Retard", => 2
  //   "Excusé", => 3
  // }

  let count = 0;
  if (studentCourseAttendances) {
    studentCourseAttendances.forEach((studentCourseAttendance) => {
      if (
        studentCourseAttendance.AttendanceValue ===
        AttendanceValueEnum["Absent"]
      ) {
        count = count + studentCourseAttendance.AttendanceValueCount;
      } else if (
        studentCourseAttendance.AttendanceValue ===
        AttendanceValueEnum["Retard"]
      ) {
        count =
          count + Math.trunc(studentCourseAttendance.AttendanceValueCount / 3);
        console.log(
          "Retard",
          Math.trunc(studentCourseAttendance.AttendanceValueCount / 3),
        );
      } else {
        count = count;
      }
    });
  }

  return count;
};
