"use client";

import { useState } from "react";
import createLevelWithCoursesCommand from "@/repositories/levels/commands/createLevelWithCoursesCommand";
import updateLevelWithCoursesCommand from "@/repositories/levels/commands/updateLevelWithCoursesCommand";
import { LevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { LevelSchema } from "@/zodSchemas/levelSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import ToggleButton from "@/components/common/toggleButton";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type LevelsFormData = z.infer<typeof LevelSchema>;

export default function LevelForm({
  levelData,
  courses,
  allCourses,
  action,
  urlParams,
}: {
  levelData: LevelsViewModel;
  courses: CourseViewModel[];
  allCourses: CourseViewModel[];
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const [periodSelected, setPeriodSelected] = useState(
    typeof urlParams?.period === "string" ? parseInt(urlParams?.period) : 4,
  );

  const form = useForm<LevelsFormData>({
    defaultValues: {
      LevelId: action !== "create" ? (levelData?.LevelId ?? 0) : 0,
      Name: action !== "create" ? (levelData?.Name ?? "") : "",
      IsEnabled: action !== "create" ? (levelData?.IsEnabled ?? true) : true,
      LevelCourses:
        action !== "create"
          ? (levelData?.LevelCourses?.map((levelCourse) => ({
              CourseId: levelCourse.CourseId,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      console.log("formData", value);
      action === "create" && createLevel(value);
      action === "edit" && updateLevel(value);
    },
  });

  const createLevel = async (formData: LevelsFormData) => {
    try {
      const response = await createLevelWithCoursesCommand(formData);

      if (!response) {
        throw new Error(`${t.levels.notifications.createFailure}`);
      }
      toast({
        title: `${t.levels.notifications.createSuccess}`,
        description: `${t.levels.title} : ${response?.level.Name}`,
      });

      router.push("/courses/levels");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.levels.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateLevel = async (formData: LevelsFormData) => {
    try {
      const response = await updateLevelWithCoursesCommand(formData);

      if (!response) {
        throw new Error(`${t.levels.notifications.updateFailure}`);
      }
      toast({
        title: `${t.levels.notifications.updateSuccess}`,
        description: `${t.levels.title} : ${formData?.Name}`,
      });

      router.push("/courses/levels");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.levels.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    // Use router.push or history.pushState depending on your navigation setup
    // router.push(newUrl);
    // or
    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mt-3 grid grid-cols-2 gap-5"
    >
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.levels.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.levels.form.name}`}
                className="w-full"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="IsEnabled"
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
      <div className="col-span-2 space-y-1">
        <form.Field
          name="LevelCourses"
          mode="array"
          children={(field) => (
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-6">
                <span className="col-span-6">{t.levels.form.addCourse}</span>
                <span className="col-span-2 mt-3 md:col-span-1">
                  {t.levels.form.coursePeriod}
                </span>
                <div className="col-span-4 mt-2 md:col-span-5">
                  <Combobox
                    options={enumToArray(PeriodEnum)}
                    textAttribute="value"
                    valueAttribute="key"
                    placeholder={t.courses.form.periodNumber}
                    itemSelected={enumToArray(PeriodEnum).find(
                      (x) => x.key === periodSelected,
                    )}
                    setItemSelected={(x: { key: number }) => {
                      setPeriodSelected(x && x.key);
                      handleUrlParameterChange("period", `${x.key}`);
                    }}
                  />
                </div>
                <span className="col-span-2 mt-3 md:col-span-1">
                  {t.levels.form.levelCourses}
                </span>
                <div className="col-span-4 mt-2 md:col-span-5">
                  <Combobox
                    options={courses}
                    textAttribute={["CourseCode", "Name"]}
                    valueAttribute="CourseId"
                    placeholder={t.levels.form.levelCourses}
                    setItemSelected={(x: { CourseId: number }) => {
                      if (
                        !field.state.value
                          ?.map((v) => v.CourseId)
                          .includes(x.CourseId)
                      )
                        field.pushValue({
                          CourseId: x && x.CourseId,
                        });
                    }}
                    disabled={action === "view"}
                    showSearch
                    notClearable
                  />
                </div>
              </div>
              <div className="space-y-3 rounded-md border bg-muted p-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-7 text-sm font-semibold">
                    {t.levels.expanded.courseName}
                  </div>
                  <div className="col-span-4 text-sm font-semibold">
                    {t.levels.expanded.courseCode}
                  </div>
                </div>
                {field.state.value?.map((studentCourse, index) => (
                  <div
                    key={index}
                    className="col-span-1 rounded-md border border-foreground/30 p-2 md:col-span-2"
                  >
                    <div className="grid grid-cols-12">
                      <div className="col-span-7 text-sm">
                        {
                          allCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.Name
                        }
                      </div>
                      <div className="col-span-4 text-sm">
                        {` ${
                          allCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.CourseCode
                        } `}
                      </div>
                      <Icon
                        name={
                          isValidIconName("MdClose")
                            ? "MdClose"
                            : "MdOutlineNotInterested"
                        }
                        className="col-span-1 cursor-pointer place-self-center text-xl hover:text-primary"
                        onClick={() => field.removeValue(index)}
                      />
                    </div>
                  </div>
                ))}
                {/* <pre>{JSON.stringify(field.state.value, null, 2)}</pre> */}
              </div>
            </div>
          )}
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() => router.push("/courses/levels")}
            >
              {t.shared.cancel}
            </Button>
            <Button
              type="submit"
              variant={"default"}
              className="w-[30%]"
              disabled={isPending}
            >
              {t.shared.save}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center space-x-3">
            <Button
              variant={"secondary"}
              className="w-[30%]"
              onClick={() => router.back()}
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(levelData, null, 2)}</pre> */}
    </form>
  );
}
