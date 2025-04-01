import getQuarterNotesByStudentId from "@/repositories/reports/queries/getQuarterNotesByStudentId";
import IFLEStudentNotesPDF from "@/components/reports/ifleStudentNotes/ifleStudentNotesPDF";
import IFLEStudentNotesAmericanPDF from "@/components/reports/ifleStudentNotes/ifleStudentNotesAmericanPDF";
import { TabsComponent } from "@/components/common/tabs";
import FrenchTranscript from "@/components/reports/ifleStudentNotes/frenchTranscript";
import AmericanTranscript from "@/components/reports/ifleStudentNotes/americanTranscript";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import frFR from "@/lang/fr-FR";

export default async function ifleStudentsNotesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const studentNotes = await getQuarterNotesByStudentId(parseInt(params.id));

  const tabs = [
    {
      id: "frenchTranscript",
      title: "Français",
      body: <FrenchTranscript studentNotesData={studentNotes} />,
    },
    {
      id: "americanTranscript",
      title: "Américain",
      body: <AmericanTranscript studentNotesData={studentNotes} />,
    },
  ];

  return (
    <main className="relative mt-5 flex justify-center">
      <div className="mt-3 w-[80vw]">
        <Button asChild className={`absolute left-0`} variant="ghost">
          <Link
            href={`/reports/ifleStudentsNotes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`}
          >
            <Icon
              name={
                isValidIconName("MdArrowBack")
                  ? "MdArrowBack"
                  : "MdOutlineNotInterested"
              }
              className="text-xl"
            />
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold">{`${t.reports.ifleStudentsNotes.titlePage} : `}</span>
            <span className="text-xl">{`${studentNotes.StudentLastName}, ${studentNotes.StudentFirstName}`}</span>
          </div>
          <div className="flex space-x-3">
            <IFLEStudentNotesPDF studentNotesData={studentNotes} />
            <IFLEStudentNotesAmericanPDF studentNotesData={studentNotes} />
          </div>
        </div>
        <TabsComponent
          tabs={tabs}
          className="mt-5 w-full"
          tabListClassName="w-[30rem]"
        />
        {/* <pre>{JSON.stringify(studentNotes.CourseNotes, null, 2)}</pre> */}
      </div>
    </main>
  );
}
