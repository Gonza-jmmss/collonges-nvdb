"use client";

import { useState } from "react";
import ChangePassword from "./changePassword";
import { StudentViewModel } from "@/repositories/students/studentsViewModel";
import { CountryViewModel } from "@/repositories/countries/countriesViewModel";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import formatDate from "@/functions/formatDate";
import frFR from "@/lang/fr-FR";

export default function StudentInfo({
  student,
  countries,
  userId,
}: {
  student: StudentViewModel | null;
  countries: CountryViewModel[];
  userId: number | null;
}) {
  const t = frFR;

  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const [display, setDisplay] = useState(false);
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{`${student?.Person.FirstName} ${student?.Person.LastName}`}</div>
          <Button variant="outlineColored" onClick={() => setOpenModal(true)}>
            <span>{t.studentProfile.changePassword.title}</span>
          </Button>
        </div>
        <div
          className="relative mt-3 grid cursor-pointer grid-cols-1 gap-1 rounded-md border bg-muted/70 p-3 md:grid-cols-2 xl:grid-cols-3"
          onClick={() => setDisplay(!display)}
        >
          <Icon
            name={`${display ? "MdKeyboardArrowUp" : "MdKeyboardArrowDown"}`}
            className="absolute right-3 top-3 cursor-pointer text-3xl"
          />
          {display ? (
            <>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.firstName}:
                </span>
                <span>{student?.Person.FirstName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.lastName}:
                </span>
                <span>{student?.Person.LastName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.birthDate}:
                </span>
                <span>
                  {formatDate(student?.Person.BirthDate || new Date())}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold md:col-span-3">
                {t.studentProfile.studentInfo}
              </div>
            </>
          )}

          {display && (
            <>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.isACA}:
                </span>
                <span>
                  {student?.Student.IsACA === true ? t.shared.yes : t.shared.no}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.email}:
                </span>
                <span>{student?.Person.Email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.telephone}:
                </span>
                <span>{student?.Person.Telephone}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.birthCountryId}:
                </span>
                <span>
                  {
                    countries.find(
                      (x) => x.CountryId === student?.Person.BirthCountryId,
                    )?.Name
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.birthCity}:
                </span>
                <span>{student?.Person.BirthCity}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.address1}:
                </span>
                <span>{student?.Person.Address1}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.yearPeriodId}:
                </span>
                <span>{student?.Student.YearPeriodName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.collegeId}:
                </span>
                <span>{student?.Student.CollegeName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">
                  {t.students.form.regimeId}:
                </span>
                <span>{student?.Student.RegimeName}</span>
              </div>
            </>
          )}
        </div>
        <ChangePassword
          openModal={openModal}
          closeModal={closeModal}
          userId={userId}
        />
      </div>
      {/* Mobile */}
      <div
        className="block transition-all duration-300 ease-in-out sm:hidden"
        onClick={() => setDisplay(!display)}
      >
        <div className="text-lg font-semibold">{`${student?.Person.FirstName} ${student?.Person.LastName}`}</div>
        <div className="relative mt-3 grid grid-cols-1 gap-2 rounded-md border bg-muted/70 p-3">
          <Icon
            name={`${display ? "MdKeyboardArrowUp" : "MdKeyboardArrowDown"}`}
            className="absolute right-3 top-3 cursor-pointer text-3xl"
          />
          {display ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.firstName}:
                </span>
                <span className="text-sm">{student?.Person.FirstName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.lastName}:
                </span>
                <span className="text-sm">{student?.Person.LastName}</span>
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold md:col-span-3">
                {t.studentProfile.studentInfo}
              </div>
            </>
          )}

          {display && (
            <>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.birthDate}:
                </span>
                <span className="text-sm">
                  {formatDate(student?.Person.BirthDate || new Date())}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{t.students.form.email}:</span>
                <span className="text-sm">{student?.Person.Email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.telephone}:
                </span>
                <span className="text-sm">{student?.Person.Telephone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.birthCountryId}:
                </span>
                <span className="text-sm">
                  {
                    countries.find(
                      (x) => x.CountryId === student?.Person.BirthCountryId,
                    )?.Name
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.birthCity}:
                </span>
                <span className="text-sm">{student?.Person.BirthCity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.address1}:
                </span>
                <span className="text-sm">{student?.Person.Address1}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.yearPeriodId}:
                </span>
                <span className="text-sm">
                  {student?.Student.YearPeriodName}
                </span>
              </div>
              {student?.Student.CollegeName && (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {t.students.form.collegeId}:
                  </span>
                  <span className="text-sm">
                    {student?.Student.CollegeName}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {t.students.form.regimeId}:
                </span>
                <span className="text-sm">{student?.Student.RegimeName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">{t.students.form.isACA}:</span>
                <span className="text-sm">
                  {student?.Student.IsACA === true ? t.shared.yes : t.shared.no}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
