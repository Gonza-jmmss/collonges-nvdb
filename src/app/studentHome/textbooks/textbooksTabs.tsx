"use client";

import { useState } from "react";
import StudentCourseContentTable from "@/components/studentTextBooks/courseContentTable";
import StudentCourseHomeworksVisualization from "@/components/studentTextBooks/courseHomeworksVisualization";
import {
  CourseContentsViewModel,
  StudentCourseHomeworksByDayViewModel,
  StudentHomeworkAmountsByTwoWeeksViewModel,
} from "@/repositories/courseTextbook/courseTextbookViewModel";
import CalendarInput from "@/components/common/calendarInput";
import { TabsComponent } from "@/components/common/tabs";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/modal";
import formatDate from "@/functions/formatDate";
import { useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";
import { addDays } from "date-fns";

export default function StudentTextBooksTabs({
  courseTextbooksData,
  courseHomeworksData,
  textbookDateSelected,
  homeworksByTowWeeks,
  tab,
  urlParams,
}: {
  courseTextbooksData: CourseContentsViewModel[];
  courseHomeworksData: StudentCourseHomeworksByDayViewModel[];
  homeworksByTowWeeks: StudentHomeworkAmountsByTwoWeeksViewModel[];
  textbookDateSelected: Date;
  tab: string | string[] | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

  const [openCloseDates, setOpenCloseDates] = useState(false);

  const tabs = [
    {
      id: "studentCourseContentTable",
      title: t.studentTextbook.tabs.contents,
      body: (
        <StudentCourseContentTable
          courseTextbooksData={courseTextbooksData}
          tabValue="studentCourseContentTable"
          //   urlParams={searchParams}
        />
      ),
    },
    {
      id: "studentCourseHomeworksVisualization",
      title: t.studentTextbook.tabs.homeworks,
      body: (
        <StudentCourseHomeworksVisualization
          courseHomeworksData={courseHomeworksData}
          tabValue="studentCourseHomeworksVisualization"
          //   urlParams={searchParams}
        />
      ),
    },
  ];

  const tabSelected = tab ? (tab as string) : tabs[0].id;

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  const subtractDays = (date: Date, days: number) => {
    date.setDate(date.getDate() - days);
    return date;
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:mt-5 sm:block">
        <div className="flex justify-start space-x-3">
          <div className="sticky top-36 flex h-auto w-32 flex-col space-y-3">
            <div className="w-32">
              <CalendarInput
                variant="outlineColored"
                dateValue={textbookDateSelected}
                setDateValue={(x: Date) => {
                  handleUrlParameterChange("textbookDate", `${x}`);
                }}
                short
              />
            </div>
            {[...Array(3)].map((_, i) => (
              <Button
                key={i}
                variant={
                  formatDate(subtractDays(new Date(), 2 - i)) ===
                  formatDate(textbookDateSelected)
                    ? "default"
                    : "outlineColored"
                }
                className=" "
                onClick={() =>
                  handleUrlParameterChange(
                    "textbookDate",
                    `${subtractDays(new Date(), 2 - i).toISOString()}`,
                  )
                }
              >
                {/* <span>{formatDate(subtractDays(new Date(), 2 - i))}</span> */}
                <div className="relative flex flex-col">
                  <span>{formatDate(subtractDays(new Date(), 2 - i))}</span>
                  <div className="absolute -left-[3.2rem] top-1 w-4 rounded-full bg-primary text-xs text-background">
                    <span>
                      {
                        homeworksByTowWeeks.find(
                          (x) =>
                            formatDate(x.HomeworkDueDate) ===
                            formatDate(subtractDays(new Date(), 2 - i)),
                        )?.Homeworks.length
                      }
                    </span>
                  </div>
                </div>
              </Button>
            ))}
            {[...Array(7)].map((_, i) => (
              <Button
                key={i}
                variant={
                  formatDate(addDays(new Date(), 1 + i)) ===
                  formatDate(textbookDateSelected)
                    ? "default"
                    : "outlineColored"
                }
                className=" "
                onClick={() =>
                  handleUrlParameterChange(
                    "textbookDate",
                    `${addDays(new Date(), 1 + i).toISOString()}`,
                  )
                }
              >
                <div className="relative flex flex-col">
                  <span>{formatDate(addDays(new Date(), 1 + i))}</span>
                  <div className="absolute -left-[3.2rem] top-1 w-4 rounded-full bg-primary text-xs text-background">
                    <span>
                      {
                        homeworksByTowWeeks.find(
                          (x) =>
                            formatDate(x.HomeworkDueDate) ===
                            formatDate(addDays(new Date(), 1 + i)),
                        )?.Homeworks.length
                      }
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <div className="-mt-5 w-full">
            <TabsComponent
              tabs={tabs}
              className="mt-5 w-full"
              tabListClassName="w-[20rem] sm:w-[30rem]"
              defaultValue={tabSelected}
            />
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="mt-5 sm:hidden">
        <div className="flex flex-col space-y-3">
          <div className="flex space-x-2">
            <Button
              variant={"outlineColored"}
              onClick={() => setOpenCloseDates(true)}
            >
              {t.studentTextbook.closeDates}
            </Button>
            <CalendarInput
              variant="outlineColored"
              dateValue={textbookDateSelected}
              setDateValue={(x: Date) => {
                handleUrlParameterChange("textbookDate", `${new Date(x)}`);
              }}
              short
            />
          </div>
          <TabsComponent
            tabs={tabs}
            className="mt-5 w-full"
            tabListClassName="w-[23rem]"
            defaultValue={tabSelected}
          />
        </div>
        <Modal
          openModal={openCloseDates}
          closeModal={() => setOpenCloseDates(false)}
        >
          <div className="flex w-full justify-center">
            <div className="mt-3 flex h-auto w-48 flex-col space-y-3">
              {[...Array(3)].map((_, i) => (
                <Button
                  key={i}
                  variant={
                    formatDate(subtractDays(new Date(), 2 - i)) ===
                    formatDate(textbookDateSelected)
                      ? "default"
                      : "outlineColored"
                  }
                  className=" "
                  onClick={() => {
                    handleUrlParameterChange(
                      "textbookDate",
                      `${subtractDays(new Date(), 2 - i).toISOString()}`,
                    );
                    setOpenCloseDates(false);
                  }}
                >
                  {/* <span>{formatDate(subtractDays(new Date(), 2 - i))}</span> */}
                  <div className="relative flex flex-col">
                    <span>{formatDate(subtractDays(new Date(), 2 - i))}</span>
                    <div className="absolute -left-[5.2rem] top-1 w-4 rounded-full bg-primary text-xs text-background">
                      <span>
                        {
                          homeworksByTowWeeks.find(
                            (x) =>
                              formatDate(x.HomeworkDueDate) ===
                              formatDate(subtractDays(new Date(), 2 - i)),
                          )?.Homeworks.length
                        }
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
              {[...Array(7)].map((_, i) => (
                <Button
                  key={i}
                  variant={
                    formatDate(addDays(new Date(), 1 + i)) ===
                    formatDate(textbookDateSelected)
                      ? "default"
                      : "outlineColored"
                  }
                  className=" "
                  onClick={() => {
                    handleUrlParameterChange(
                      "textbookDate",
                      `${addDays(new Date(), 1 + i).toISOString()}`,
                    );
                    setOpenCloseDates(false);
                  }}
                >
                  <div className="relative flex flex-col">
                    <span>{formatDate(addDays(new Date(), 1 + i))}</span>
                    <div className="absolute -left-[5.2rem] top-1 w-4 rounded-full bg-primary text-xs text-background">
                      <span>
                        {
                          homeworksByTowWeeks.find(
                            (x) =>
                              formatDate(x.HomeworkDueDate) ===
                              formatDate(addDays(new Date(), 1 + i)),
                          )?.Homeworks.length
                        }
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Modal>
      </div>
      {/* <pre>{JSON.stringify(attendancesData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(courseHomeworksData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(homeworksByTowWeeks, null, 2)}</pre> */}
    </>
  );
}
