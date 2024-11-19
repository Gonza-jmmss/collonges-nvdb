import enUS from "@/lang/en-US";
import Link from "next/link";

export default async function StudentsPage() {
  const t = enUS;

  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.reports.pageTitle}</span>
        </div>
        <div className="mt-10 grid grid-cols-3">
          <Link href={"/reports/ifleStudentsNotes"}>
            <div className="rounded-md border-2 p-4">
              {t.reports.ifleStudentsNotes.title}
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
