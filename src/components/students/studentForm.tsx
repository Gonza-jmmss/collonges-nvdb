"use client";

import { useState, useRef } from "react";
import createStudentCommand from "@/repositories/students/commands/createStudentPersonCommand";
import updateStudentPersonCommand from "@/repositories/students/commands/updateStudentPersonCommand";
import { SexEnum } from "@/enum/sexEnum";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import DateInput from "@/components/common/dateInput";
import Combobox from "@/components/common/combobox";
import ToggleButton from "@/components/common/toggleButton";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { Button } from "@/components/ui/button";
import { CountryViewModel } from "@/repositories/countries/countriesViewModel";
import { CollegeViewModel } from "@/repositories/colleges/collegesViewModel";
import { RegimeViewModel } from "@/repositories/regimes/regimesViewModel";
import { ContactTypeViewModel } from "@/repositories/personContactTypes/peronContactTypesViewModel";
import { NonStudentsViewModel } from "@/repositories/persons/persionsViewModel";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import enumToArray from "@/functions/enumToArray";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type StudentFormData = z.infer<typeof StudentPersonSchema>;

export default function StudentForm({
  studentData,
  action,
  countries,
  colleges,
  regimes,
  contactTypes,
  nonStudents,
}: {
  studentData: StudentFormData | null;
  action: string;
  countries: CountryViewModel[];
  colleges: CollegeViewModel[];
  regimes: RegimeViewModel[];
  contactTypes: ContactTypeViewModel[];
  nonStudents: NonStudentsViewModel[];
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const studentType = [{ StudentTypeId: 1, Name: "IFLE" }];

  const form = useForm<StudentFormData>({
    defaultValues: {
      Person: {
        PersonId:
          action !== "create" ? (studentData?.Person.PersonId ?? null) : null,
        FirstName:
          action !== "create" ? (studentData?.Person.FirstName ?? null) : null,
        LastName:
          action !== "create" ? (studentData?.Person.LastName ?? null) : null,
        BirthDate:
          action !== "create" ? (studentData?.Person.BirthDate ?? null) : null,
        Sex: action !== "create" ? (studentData?.Person.Sex ?? null) : null,
        Telephone:
          action !== "create" ? (studentData?.Person.Telephone ?? null) : null,
        WorkTelephone:
          action !== "create"
            ? (studentData?.Person.WorkTelephone ?? null)
            : null,
        BirthCity:
          action !== "create" ? (studentData?.Person.BirthCity ?? null) : null,
        Address1:
          action !== "create" ? (studentData?.Person.Address1 ?? null) : null,
        BirthCountryId:
          action !== "create"
            ? (studentData?.Person.BirthCountryId ?? null)
            : null,
        CountryId: null,
        Email: action !== "create" ? (studentData?.Person.Email ?? null) : null,
        DBaseCode:
          action !== "create" ? (studentData?.Person.DBaseCode ?? null) : null,
        ImageName:
          action !== "create" ? (studentData?.Person.ImageName ?? null) : null,
        ImageNameTemp: null,
      },
      Student: {
        StudentId:
          action !== "create" ? (studentData?.Student.StudentId ?? null) : null,
        StudentTypeId:
          action !== "create" ? (studentData?.Student.StudentTypeId ?? 1) : 1,
        IsACA:
          action !== "create" ? (studentData?.Student.IsACA ?? true) : true,
        CollegeId:
          action !== "create" ? (studentData?.Student.CollegeId ?? null) : null,
        RegimeId:
          action !== "create" ? (studentData?.Student.RegimeId ?? null) : null,
        IsEnabled:
          action !== "create" ? (studentData?.Student.IsEnabled ?? true) : true,
      },
      ContactPerson:
        action !== "create"
          ? (studentData?.ContactPerson?.map((contact) => ({
              PersonId: contact.PersonId,
              ContactTypeId: contact.ContactTypeId,
              FirstName: contact.FirstName,
              LastName: contact.LastName,
              Telephone: contact.Telephone,
              WorkTelephone: contact.WorkTelephone,
              BirthCity: contact.BirthCity,
              Address1: contact.Address1,
              CountryId: contact.CountryId,
              Email: contact.Email,
              LoadType: null,
              BirthDate: null,
              Sex: null,
              BirthCountryId: null,
              DBaseCode: null,
              ImageName: null,
              ImageNameTemp: null,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { fileName } = await uploadResponse.json();
        value.Person.ImageNameTemp = fileName;
      }

      setIsPending(true);
      action === "create" && createStudent(value);
      action === "edit" && updateStudent(value);
    },
  });

  const createStudent = async (formData: StudentFormData) => {
    try {
      const response = await createStudentCommand(formData);

      if (!response) {
        throw new Error(`${t.students.notifications.createFailure}`);
      }

      toast({
        title: `${t.students.notifications.createSuccess}`,
        description: `${t.students.student} : ${response.person.AlternativeName}`,
        // description: `${t.students.student} : ${response}`,
      });

      router.push("/students");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.students.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateStudent = async (formData: StudentFormData) => {
    try {
      const response = await updateStudentPersonCommand(formData);

      if (!response) {
        throw new Error(`${t.students.notifications.updateFailure}`);
      }

      toast({
        title: `${t.students.notifications.updateSuccess}`,
        description: `${t.students.student} : ${response.person?.AlternativeName}`,
        // description: `${t.students.student} : student`,
      });

      // Delete old photo
      if (studentData?.Person.ImageName !== null) {
        const imageData = new FormData();
        imageData.append("image", studentData?.Person.ImageName || "");

        const deleteResponse = await fetch("/api/images/delete", {
          method: "POST",
          body: imageData,
        });

        if (!deleteResponse.ok) {
          throw new Error("Image elimination failed");
        }
      }

      router.push("/students");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.students.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  // const updateImage = async (image: string) => {
  //   console.log("image", image);
  //   const formData = new FormData();
  //   formData.append("image", image);

  //   const uploadResponse = await fetch("/api/images/delete", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   console.log("uploadResponse", uploadResponse);
  // };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <div className="absolute right-5 top-5 col-span-1 space-y-1 md:col-span-2">
        <form.Field
          name="Person.ImageName"
          children={(field) => (
            <>
              <div className="flex items-center justify-end space-x-3">
                {action !== "view" && (
                  <div className="space-y-1">
                    <Input
                      ref={imageInputRef}
                      id="ImageName"
                      name="ImageName"
                      type={"file"}
                      accept="image/jpg, image/jpeg, image/png"
                      className="hidden"
                      // value={field.state.value || ""}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        handleFileChange(e);
                      }}
                      disabled={action === "view"}
                    />
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="flex space-x-2"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Icon
                        name={
                          isValidIconName("MdCloudUpload")
                            ? "MdCloudUpload"
                            : "MdOutlineNotInterested"
                        }
                        className="text-3xl"
                      />
                      <span>{t.students.form.personImage}</span>
                    </Button>
                  </div>
                )}
                <Image
                  src={`${
                    field.state.value
                      ? field.state.value?.includes("fakepath")
                        ? preview
                        : `/api/images/${field.state.value}`
                      : "/404image.png"
                  }`}
                  alt={"ImageName"}
                  width={800}
                  height={800}
                  style={{
                    objectFit: "cover",
                    width: "4rem",
                    height: "4rem",
                    padding: "1px",
                    borderWidth: "2px",
                    borderRadius: "0.375rem",
                    borderColor: "rgb(212 212 212)",
                  }}
                />
                {/* <Button
                  type="button"
                  variant={"ghost"}
                  className="flex space-x-2"
                  onClick={() => updateImage(field.state.value || "")}
                >
                  Update
                </Button> */}
              </div>
            </>
          )}
        />
      </div>
      <div className="mt-7 space-y-1">
        <form.Field
          name="Person.FirstName"
          children={(field) => (
            <>
              <span>{t.students.form.firstName}</span>
              <Input
                id="FirstName"
                name="FirstName"
                placeholder={`${t.students.form.firstName}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1 md:mt-7">
        <form.Field
          name="Person.LastName"
          children={(field) => (
            <>
              <span>{t.students.form.lastName}</span>
              <Input
                id="LastName"
                name="LastName"
                placeholder={`${t.students.form.lastName}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Person.BirthDate"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.students.validations.bithDateValidation;
              }
              return z.date().safeParse(value.value).success
                ? undefined
                : t.students.validations.bithDateValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.students.form.birthDate}</span>
              <DateInput
                dateForm={field.state.value}
                setItemSelected={(x: Date) => {
                  field.handleChange(x);
                }}
                disabled={action === "view"}
              />
              <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div>
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Person.Sex"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.students.validations.sexValidation;
              }
              return z.number().min(0).safeParse(value.value).success
                ? undefined
                : t.students.validations.sexValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.students.form.sex}</span>
              <Combobox
                options={enumToArray(SexEnum)}
                textAttribute="value"
                valueAttribute="key"
                placeholder={t.students.form.sex}
                itemSelected={enumToArray(SexEnum).find(
                  (x) => x.key === field.state.value,
                )}
                setItemSelected={(x: { key: number }) => {
                  field.handleChange(x && x.key);
                }}
                disabled={action === "view"}
                showSearch
              />
              <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div>
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        {/* <div className="col-span-1 space-y-1 md:col-span-2"> */}
        <form.Field
          name="Person.Email"
          children={(field) => (
            <>
              <span>{t.students.form.email}</span>
              <Input
                id="Email"
                name="Email"
                placeholder={`${t.students.form.email}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Person.DBaseCode"
          children={(field) => (
            <>
              <span>{t.students.form.dBaseCode}</span>
              <Input
                id="DBaseCode"
                name="DBaseCode"
                placeholder={`${t.students.form.dBaseCode}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Person.Telephone"
          children={(field) => (
            <>
              <span>{t.students.form.telephone}</span>
              <Input
                id="Telephone"
                name="Telephone"
                placeholder={`${t.students.form.telephone}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Person.WorkTelephone"
          children={(field) => (
            <>
              <span>{t.students.form.workTelephone}</span>
              <Input
                id="WorkTelephone"
                name="WorkTelephone"
                placeholder={`${t.students.form.workTelephone}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <form.Field
            name="Person.BirthCountryId"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.students.validations.countryValidation;
                }
                return z.number().min(0).safeParse(value.value).success
                  ? undefined
                  : t.students.validations.countryValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.students.form.birthCountryId}</span>
                <Combobox
                  options={countries}
                  textAttribute="Name"
                  valueAttribute="CountryId"
                  placeholder={t.students.form.birthCountryId}
                  itemSelected={countries.find(
                    (x) => x.CountryId === field.state.value,
                  )}
                  setItemSelected={(x: { CountryId: number }) => {
                    field.handleChange(x && x.CountryId);
                  }}
                  disabled={action === "view"}
                  showSearch
                />
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
        <div className="space-y-1">
          <form.Field
            name="Person.BirthCity"
            children={(field) => (
              <>
                <span>{t.students.form.birthCity}</span>
                <Input
                  id="BirthCity"
                  name="BirthCity"
                  placeholder={`${t.students.form.birthCity}`}
                  className="w-full"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={action === "view"}
                  required
                />
              </>
            )}
          />
        </div>
        <div className="space-y-1">
          <form.Field
            name="Person.Address1"
            children={(field) => (
              <>
                <span>{t.students.form.address1}</span>
                <Input
                  id="Address1"
                  name="Address1"
                  placeholder={`${t.students.form.address1}`}
                  className="w-full"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={action === "view"}
                  required
                />
              </>
            )}
          />
        </div>
      </div>
      {/*         */}
      {/* Student */}
      {/*         */}
      <div className="col-span-1 grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <form.Field
            name="Student.StudentTypeId"
            children={(field) => (
              <>
                <span>{t.students.form.studentTypeId}</span>
                <Combobox
                  options={studentType}
                  textAttribute="Name"
                  valueAttribute="StudentTypeId"
                  placeholder={t.students.form.birthCountryId}
                  itemSelected={studentType.find(
                    (x) => x.StudentTypeId === field.state.value,
                  )}
                  setItemSelected={(x: { StudentTypeId: number }) => {
                    field.handleChange(x && x.StudentTypeId);
                  }}
                  disabled={true}
                  showSearch
                />
              </>
            )}
          />
        </div>
        <div className="space-y-1">
          <form.Field
            name="Student.CollegeId"
            children={(field) => (
              <>
                <span>{t.students.form.collegeId}</span>
                <Combobox
                  options={colleges}
                  textAttribute="Name"
                  valueAttribute="CollegeId"
                  placeholder={t.students.form.collegeId}
                  itemSelected={colleges.find(
                    (x) => x.CollegeId === field.state.value,
                  )}
                  setItemSelected={(x: { CollegeId: number }) => {
                    field.handleChange(x && x.CollegeId);
                  }}
                  disabled={action === "view"}
                  showSearch
                />
              </>
            )}
          />
        </div>
        <div className="space-y-1">
          <form.Field
            name="Student.RegimeId"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.students.validations.regimeValidation;
                }
                return z.number().min(0).safeParse(value.value).success
                  ? undefined
                  : t.students.validations.regimeValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.students.form.regimeId}</span>
                <Combobox
                  options={regimes}
                  textAttribute="Name"
                  valueAttribute="RegimeId"
                  placeholder={t.students.form.regimeId}
                  itemSelected={regimes.find(
                    (x) => x.RegimeId === field.state.value,
                  )}
                  setItemSelected={(x: { RegimeId: number }) => {
                    field.handleChange(x && x.RegimeId);
                  }}
                  disabled={action === "view"}
                  showSearch
                />
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="space-y-1">
        <form.Field
          name="Student.IsACA"
          children={(field) => (
            <>
              <span>{t.students.form.isACA}</span>
              <ToggleButton
                options={[
                  { key: true, value: t.shared.no },

                  { key: false, value: t.shared.yes },
                ]}
                setItemSelected={(x: { key: boolean; value: string }) => {
                  field.handleChange(x && x.key);
                }}
                itemSelected={field.state.value}
                disabled={action === "view"}
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="Student.IsEnabled"
          children={(field) => (
            <>
              <span>{t.students.form.isEnabled}</span>
              <ToggleButton
                options={[
                  { key: false, value: t.shared.no },

                  { key: true, value: t.shared.yes },
                ]}
                setItemSelected={(x: { key: boolean; value: string }) => {
                  field.handleChange(x && x.key);
                }}
                itemSelected={field.state.value}
                disabled={action === "view"}
              />
            </>
          )}
        />
      </div>
      {/*              */}
      {/* ContactPeron */}
      {/*              */}
      <form.Field
        name="ContactPerson"
        mode="array"
        children={(field) => (
          <>
            {action !== "view" && (
              <div className="col-span-1 flex space-x-5 md:col-span-2">
                <Button
                  type="button"
                  variant={"outlineColored"}
                  onClick={() =>
                    field.pushValue({
                      PersonId: null,
                      ContactTypeId: 0,
                      FirstName: null,
                      LastName: null,
                      Telephone: null,
                      WorkTelephone: null,
                      BirthCity: null,
                      Address1: null,
                      CountryId: null,
                      Email: null,
                      LoadType: null,
                      BirthDate: null,
                      Sex: null,
                      BirthCountryId: null,
                      DBaseCode: null,
                      ImageName: null,
                      ImageNameTemp: null,
                    })
                  }
                >
                  {t.students.form.addContact}
                </Button>
              </div>
            )}
            {field.state.value?.map((contact, index) => (
              <div
                key={index}
                className="col-span-1 rounded-md border p-3 md:col-span-2"
              >
                <div className="flex justify-between space-x-3">
                  <span className="text-xl font-semibold">
                    {t.students.form.contact}
                  </span>
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => field.removeValue(index)}
                  >
                    <Icon
                      name={
                        isValidIconName("MdClose")
                          ? "MdClose"
                          : "MdOutlineNotInterested"
                      }
                      className="text-xl"
                    />
                  </Button>
                </div>
                {contact.PersonId === null && contact.LoadType === null && (
                  <div className="mt-3 flex w-full flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0">
                    <form.Field
                      name={`ContactPerson[${index}].LoadType`}
                      children={(field) => (
                        <>
                          <Button
                            type="button"
                            variant={"outlineColored"}
                            className="w-full"
                            onClick={() => {
                              field.handleChange(1);
                            }}
                          >
                            {t.students.form.loadContactData}
                          </Button>
                          <Button
                            type="button"
                            variant={"outlineColored"}
                            className="w-full"
                            onClick={() => {
                              field.handleChange(2);
                            }}
                          >
                            {t.students.form.selectContact}
                          </Button>
                        </>
                      )}
                    />
                  </div>
                )}
                {(contact.PersonId !== null && contact.LoadType === null) ||
                (contact.LoadType && contact.LoadType === 1) ? (
                  <>
                    <div className="space-y-1">
                      <form.Field
                        name={`ContactPerson[${index}].ContactTypeId`}
                        validators={{
                          onSubmitAsync: (value) => {
                            if (value === null || value === undefined) {
                              return t.students.validations
                                .contactTypeValidation;
                            }
                            return z.number().min(1).safeParse(value.value)
                              .success
                              ? undefined
                              : t.students.validations.contactTypeValidation;
                          },
                        }}
                        children={(field) => (
                          <>
                            <span>{t.students.form.contactTypeId}</span>
                            <Combobox
                              options={contactTypes}
                              textAttribute="Name"
                              valueAttribute="ContactTypeId"
                              placeholder={t.students.form.contactTypeId}
                              itemSelected={contactTypes.find(
                                (x) => x.ContactTypeId === field.state.value,
                              )}
                              setItemSelected={(x: {
                                ContactTypeId: number;
                              }) => {
                                field.handleChange(x && x.ContactTypeId);
                              }}
                              disabled={action === "view"}
                              showSearch
                            />
                            <div className="text-xs text-red-500">
                              {field.state.meta.errors}
                            </div>
                          </>
                        )}
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].FirstName`}
                          children={(field) => (
                            <>
                              <span>{t.students.form.firstName}</span>
                              <Input
                                id="FirstName"
                                name="FirstName"
                                placeholder={`${t.students.form.firstName}`}
                                className="w-full"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={action === "view"}
                                required
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].LastName`}
                          children={(field) => (
                            <>
                              <span>{t.students.form.lastName}</span>
                              <Input
                                id="LastName"
                                name="LastName"
                                placeholder={`${t.students.form.lastName}`}
                                className="w-full"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={action === "view"}
                                required
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="col-span-1 space-y-1 md:col-span-2">
                        <form.Field
                          name={`ContactPerson[${index}].Email`}
                          children={(field) => (
                            <>
                              <span>{t.students.form.email}</span>
                              <Input
                                id="Email"
                                name="Email"
                                placeholder={`${t.students.form.email}`}
                                className="w-full"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={action === "view"}
                                required
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].Telephone`}
                          children={(field) => (
                            <>
                              <span>{t.students.form.telephone}</span>
                              <Input
                                id="Telephone"
                                name="Telephone"
                                placeholder={`${t.students.form.telephone}`}
                                className="w-full"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={action === "view"}
                                required
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].WorkTelephone`}
                          children={(field) => (
                            <>
                              <span>{t.students.form.workTelephone}</span>
                              <Input
                                id="WorkTelephone"
                                name="WorkTelephone"
                                placeholder={`${t.students.form.workTelephone}`}
                                className="w-full"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={action === "view"}
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="col-span-1 grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                          <form.Field
                            name={`ContactPerson[${index}].CountryId`}
                            validators={{
                              onSubmitAsync: (value) => {
                                if (value === null || value === undefined) {
                                  return t.students.validations
                                    .countryValidation;
                                }
                                return z.number().min(0).safeParse(value.value)
                                  .success
                                  ? undefined
                                  : t.students.validations.countryValidation;
                              },
                            }}
                            children={(field) => (
                              <>
                                <span>{t.students.form.countryId}</span>
                                <Combobox
                                  options={countries}
                                  textAttribute="Name"
                                  valueAttribute="CountryId"
                                  placeholder={t.students.form.countryId}
                                  itemSelected={countries.find(
                                    (x) => x.CountryId === field.state.value,
                                  )}
                                  setItemSelected={(x: {
                                    CountryId: number;
                                  }) => {
                                    field.handleChange(x && x.CountryId);
                                  }}
                                  disabled={action === "view"}
                                  showSearch
                                />
                                <div className="text-xs text-red-500">
                                  {field.state.meta.errors
                                    ? field.state.meta.errors.join(", ")
                                    : null}
                                </div>
                              </>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <form.Field
                            name={`ContactPerson[${index}].BirthCity`}
                            children={(field) => (
                              <>
                                <span>{t.students.form.contactCity}</span>
                                <Input
                                  id="BirthCity"
                                  name="BirthCity"
                                  placeholder={`${t.students.form.contactCity}`}
                                  className="w-full"
                                  value={field.state.value || ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  disabled={action === "view"}
                                  required
                                />
                              </>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <form.Field
                            name={`ContactPerson[${index}].Address1`}
                            children={(field) => (
                              <>
                                <span>{t.students.form.address1}</span>
                                <Input
                                  id="Address1"
                                  name="Address1"
                                  placeholder={`${t.students.form.address1}`}
                                  className="w-full"
                                  value={field.state.value || ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  disabled={action === "view"}
                                  required
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  contact.LoadType === 2 && (
                    <>
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].ContactTypeId`}
                          validators={{
                            onSubmitAsync: (value) => {
                              if (value === null || value === undefined) {
                                return t.students.validations
                                  .contactTypeValidation;
                              }
                              return z.number().min(1).safeParse(value.value)
                                .success
                                ? undefined
                                : t.students.validations.contactTypeValidation;
                            },
                          }}
                          children={(field) => (
                            <>
                              <span>{t.students.form.contactTypeId}</span>
                              <Combobox
                                options={contactTypes}
                                textAttribute="Name"
                                valueAttribute="ContactTypeId"
                                placeholder={t.students.form.contactTypeId}
                                itemSelected={contactTypes.find(
                                  (x) => x.ContactTypeId === field.state.value,
                                )}
                                setItemSelected={(x: {
                                  ContactTypeId: number;
                                }) => {
                                  field.handleChange(x && x.ContactTypeId);
                                }}
                                disabled={action === "view"}
                                showSearch
                              />
                              <div className="text-xs text-red-500">
                                {field.state.meta.errors}
                              </div>
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <form.Field
                          name={`ContactPerson[${index}].PersonId`}
                          validators={{
                            onSubmitAsync: (value) => {
                              if (value === null || value === undefined) {
                                return t.students.validations.contactValidation;
                              }
                              return z.number().min(1).safeParse(value.value)
                                .success
                                ? undefined
                                : t.students.validations.contactValidation;
                            },
                          }}
                          children={(field) => (
                            <>
                              <span>{t.students.form.personId}</span>
                              <Combobox
                                options={nonStudents}
                                textAttribute={["AlternativeName", "Email"]}
                                valueAttribute="PersonId"
                                placeholder={t.students.form.personId}
                                itemSelected={nonStudents.find(
                                  (x) => x.PersonId === field.state.value,
                                )}
                                setItemSelected={(x: { PersonId: number }) => {
                                  field.handleChange(x && x.PersonId);
                                }}
                                disabled={action === "view"}
                                showSearch
                              />
                              <div className="text-xs text-red-500">
                                {field.state.meta.errors
                                  ? field.state.meta.errors.join(", ")
                                  : null}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </>
                  )
                )}
              </div>
            ))}
          </>
        )}
      />
      {action !== "view" ? (
        <div className="col-span-1 flex justify-center space-x-5 md:col-span-2">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[40%]"
            onClick={() => router.back()}
          >
            {t.shared.cancel}
          </Button>
          <Button
            type="submit"
            variant={"default"}
            className="w-[40%]"
            disabled={isPending}
          >
            {t.shared.save}
          </Button>
        </div>
      ) : (
        <div className="col-span-2 flex justify-center space-x-3">
          <Button
            // type="button"
            variant={"secondary"}
            className="w-[40%]"
            onClick={() => router.back()}
          >
            {t.shared.cancel}
          </Button>
        </div>
      )}
      {/* <pre>{JSON.stringify(studentData, null, 2)}</pre> */}
    </form>
  );
}
