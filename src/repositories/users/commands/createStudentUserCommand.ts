"use server";

import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import getStudentByIdQuery from "@/repositories/students/queries/getStudentByIdQuery";
import createUserCommand from "./createUserCommand";
import getStudentHasUserQuery from "../queries/getStudentHasUserQuery";

type createStudentUserCommandParams = {
  StudentId: number;
};

const createStudentUserCommand = async (
  params: createStudentUserCommandParams,
) => {
  const roles = await getAllRolesQuery({ IsEnabled: true });
  const studentRole = roles.find((x) => x.Name === "Étudiant");

  if (studentRole === undefined) {
    throw Error(
      "Le rôle Étudiant n'existe pas, créez le rôle « Étudiant » et réessayez",
    );
  }

  const studentHasUser = await getStudentHasUserQuery({
    StudentId: params.StudentId,
  });

  if (studentHasUser !== null) {
    throw Error("L'utilisateur a déjà été créé");
  }

  const student = await getStudentByIdQuery(params.StudentId);

  // Create a user for the student
  if (studentRole !== undefined) {
    const studentUser = {
      UserName: `${student.Person.FirstName?.split(" ")[0]}.${student.Person.LastName?.split(" ")[0]}`,
      Password: `${student.Person.FirstName?.split(" ")[0]}.${student.Student.StudentId}`,
      RoleId: studentRole.RoleId,
      IsEnabled: true,
      StudentId: student.Student.StudentId,
    };
    await createUserCommand(studentUser);
  }

  return student;
};

export default createStudentUserCommand;
