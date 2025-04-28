import { PrismaClient } from "@prisma/client";
import { PersonsMap } from "../persionsViewModel";

const prisma = new PrismaClient();

const getAllNonStudentsQuery = async () => {
  const query = await prisma.persons.findMany({
    where: {
      PersonId: {
        notIn: await prisma.students
          .findMany({
            select: { PersonId: true },
          })
          .then((students) => students.map((s) => s.PersonId)),
      },
    },
  });

  const res = query.map((person: PersonsMap) => ({
    PersonId: person.PersonId,
    AlternativeName: person.AlternativeName,
    Email: person.Email,
  }));

  return res;
};

export default getAllNonStudentsQuery;
