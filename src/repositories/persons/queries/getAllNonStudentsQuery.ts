import { PrismaClient } from "@prisma/client";
import { PersonsViewModel } from "../persionsViewModel";

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

  const res = query.map((person: PersonsViewModel) => ({
    PersonId: person.PersonId,
    AlternativeName: person.AlternativeName,
    Email: person.Email,
  }));

  return res;
};

export default getAllNonStudentsQuery;
