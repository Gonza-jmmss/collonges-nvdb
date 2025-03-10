import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { TeachersMap } from "../usersViewModel";

const prisma = new PrismaClient();

const getTearchersQuery = cache(async () => {
  const query = await prisma.users.findMany({
    where: { Roles: { Name: "Professeur", IsEnabled: true }, IsEnabled: true },
  });

  const res = query.map((users: TeachersMap) => ({
    UserId: users.UserId,
    UserName: users.UserName,
    IsEnabled: users.IsEnabled,
  }));

  return res;
});

export default getTearchersQuery;
