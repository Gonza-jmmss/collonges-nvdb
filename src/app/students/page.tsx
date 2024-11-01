import prisma from "@/lib/db";
import StudentsTable from "./studentsTable";

export default async function StudentsPage() {
  const students = await prisma.students.findMany();

  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-end space-x-3">
          <span>Students</span>
        </div>
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
        <StudentsTable studentsData={students} />
      </div>
    </main>
  );
}
