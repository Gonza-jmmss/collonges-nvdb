import frFR from "@/lang/fr-FR";

export default function Student() {
  const t = frFR;
  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.student.student}</span>
        </div>
        {/* <StudentsTable studentsData={students} /> */}
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
      </div>
    </main>
  );
}
