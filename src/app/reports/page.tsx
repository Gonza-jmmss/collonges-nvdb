import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function StudentsPage() {
  const t = frFR;

  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.reports.pageTitle}</span>
        </div>
        <div className="mt-10 grid grid-cols-3">
          <Link href={"/reports/ifleStudentsNotes"}>
            <Button
              variant={"outline"}
              size={"lg"}
              className="h-16 w-full justify-start border-2 p-4"
            >
              <span className="text-base">
                {t.reports.ifleStudentsNotes.title}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
