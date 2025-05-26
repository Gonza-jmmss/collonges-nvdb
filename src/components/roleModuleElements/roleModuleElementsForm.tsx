"use client";

import { useEffect, useState } from "react";
import createRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/createRoleModuleElementCommand";
import updateRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/updateRoleModuleElementCommand";
import { RoleModuleElementSchema } from "@/zodSchemas/roleModuleElementSchema";
import { RoleModuleElementsGroupedViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { ModuleElementsViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type RoleModuleElementFormData = z.infer<typeof RoleModuleElementSchema>;

export default function RoleModuleElementForm({
  roleModuleElementData,
  modules,
  moduleElements,
  roles,
  rolesWithoutModuleElements,
  action,
}: {
  roleModuleElementData: RoleModuleElementsGroupedViewModel | null;
  modules: ModulesViewModel[];
  moduleElements: ModuleElementsViewModel[];
  roles: RolesViewModel[];
  rolesWithoutModuleElements: RolesViewModel[];
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<RoleModuleElementFormData>({
    defaultValues: {
      RoleId:
        action !== "create"
          ? roleModuleElementData
            ? roleModuleElementData.RoleId
            : 0
          : 0,
      Modules:
        action !== "create"
          ? (roleModuleElementData?.Modules?.map((module) => ({
              // RoleModuleElementId: module.RoleModuleElementId,
              ModuleId: module.ModuleId,
            })) ?? null)
          : null,
      ModuleElements:
        action !== "create"
          ? (roleModuleElementData?.ModuleElements?.map((moduleElement) => ({
              // RoleModuleElementId: moduleElement.RoleModuleElementId,
              ModuleElementId: moduleElement.ModuleElementId,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      console.log("form", value);
      // setIsPending(true)
      action === "create" && createRoleModuleElement(value);
      action === "edit" && updateRoleModuleElement(value);
    },
  });

  const createRoleModuleElement = async (
    formData: RoleModuleElementFormData,
  ) => {
    try {
      const response = await createRoleModuleElementCommand(formData);

      if (!response) {
        throw new Error(`${t.roleModuleElements.notifications.createFailure}`);
      }
      toast({
        title: `${t.roleModuleElements.notifications.createSuccess}`,
        description: `${t.roleModuleElements.title} : ${roles.find((x) => x.RoleId === formData.RoleId)?.Name}`,
      });

      router.push("/settings/roleModuleElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleModuleElements.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateRoleModuleElement = async (
    formData: RoleModuleElementFormData,
  ) => {
    try {
      const response = await updateRoleModuleElementCommand(formData);

      if (!response) {
        throw new Error(`${t.roleModuleElements.notifications.updateFailure}`);
      }
      toast({
        title: `${t.roleModuleElements.notifications.updateSuccess}`,
        // description: `${t.roleModuleElements.title} : ${response.ModuleId !== null ? response.ModuleId : ""}${response.ModuleElementId !== null ? response.ModuleElementId : ""}-${response.RoleId}`,
        description: `${t.roleModuleElements.title} : ${roles.find((x) => x.RoleId === formData.RoleId)?.Name}`,
      });

      router.push("/settings/roleModuleElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleModuleElements.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  // const elementType = [
  //   { Name: t.moduleElements.title, Value: 1 },
  //   { Name: t.modules.title, Value: 2 },
  // ];
  // const [elementTypeSelected, setElementTypeSelected] = useState({
  //   Name: "",
  //   Value: 0,
  // });

  // useEffect(() => {
  //   if (elementTypeSelected.Value === 1) {
  //     form.setFieldValue("ModuleId", null);
  //   } else if (elementTypeSelected.Value === 2) {
  //     form.setFieldValue("ModuleElementId", null);
  //   }
  // }, [elementTypeSelected]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col space-y-5"
    >
      {/* 
      <div className="space-y-1">
        <form.Field
          name="ModuleId"
          children={(field) => (
            <>
              <span
                className={`${elementTypeSelected.Name !== t.modules.title ? "text-neutral-500" : ""}`}
              >
                {t.roleModuleElements.form.moduleId}
              </span>
              <Combobox
                options={modules}
                textAttribute="Name"
                valueAttribute="ModuleId"
                placeholder={t.roleModuleElements.form.moduleId}
                itemSelected={modules.find(
                  (x) => x.ModuleId === field.state.value,
                )}
                setItemSelected={(x: { ModuleId: number; Name: string }) => {
                  field.handleChange(x && x.ModuleId);
                }}
                disabled={
                  action === "view" ||
                  elementTypeSelected.Name !== t.modules.title
                }
                showSearch
              />
            </>
          )}
        />
      </div> */}
      <div className="space-y-1">
        <form.Field
          name="RoleId"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.roleModuleElements.validations.roleValidation;
              }
              return z.number().min(1).safeParse(value.value).success
                ? undefined
                : t.roleModuleElements.validations.roleValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.roleModuleElements.form.roleId}</span>
              <Combobox
                options={rolesWithoutModuleElements}
                textAttribute="Name"
                valueAttribute="RoleId"
                placeholder={t.roleModuleElements.form.roleId}
                itemSelected={roles.find((x) => x.RoleId === field.state.value)}
                setItemSelected={(x: { RoleId: number; Name: string }) => {
                  field.handleChange(x && x.RoleId);
                }}
                disabled={action !== "create"}
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
          name="Modules"
          mode="array"
          children={(field) => (
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-6">
                <span className="col-span-6">
                  {t.roleModuleElements.form.moduleId}
                </span>
                <div className="col-span-6 mt-2">
                  <Combobox
                    options={modules}
                    textAttribute={"Name"}
                    valueAttribute="ModuleId"
                    placeholder={t.roleModuleElements.form.moduleId}
                    setItemSelected={(x: { ModuleId: number }) => {
                      if (
                        !field.state.value
                          ?.map((v) => v.ModuleId)
                          .includes(x.ModuleId)
                      )
                        field.pushValue({
                          ModuleId: x && x.ModuleId,
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
                  <div className="col-span-11 text-sm font-semibold">
                    {t.roleModuleElements.columns.moduleName}
                  </div>
                  {/* <div className="col-span-6 text-sm font-semibold">
                    {t.roleModuleElements.columns.path}
                  </div> */}
                </div>
                {field.state.value
                  ?.map((module, index) => (
                    <div
                      key={index}
                      className="col-span-1 rounded-md border border-foreground/30 p-2 md:col-span-2"
                    >
                      <div className="grid grid-cols-12">
                        <div className="col-span-11 text-sm">
                          {
                            modules.find((x) => x.ModuleId === module.ModuleId)
                              ?.Name
                          }
                        </div>
                        {/* <div className="col-span-6 text-sm">
                          {` ${
                            modules.find((x) => x.ModuleId === module.ModuleId)
                              ?.Path
                          } `}
                        </div> */}
                        <Icon
                          name="MdClose"
                          className="col-span-1 cursor-pointer place-self-center text-xl hover:text-primary"
                          onClick={() => field.removeValue(index)}
                        />
                      </div>
                    </div>
                  ))
                  .reverse()}
              </div>
            </div>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="ModuleElements"
          mode="array"
          children={(field) => (
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-6">
                <span className="col-span-6">
                  {t.roleModuleElements.form.moduleElementId}
                </span>
                <div className="col-span-6 mt-2">
                  <Combobox
                    options={moduleElements}
                    textAttribute={["ModuleName", "Name"]}
                    valueAttribute="ModuleElementId"
                    placeholder={t.roleModuleElements.form.moduleElementId}
                    setItemSelected={(x: { ModuleElementId: number }) => {
                      if (
                        !field.state.value
                          ?.map((v) => v.ModuleElementId)
                          .includes(x.ModuleElementId)
                      )
                        field.pushValue({
                          ModuleElementId: x && x.ModuleElementId,
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
                  <div className="col-span-5 text-sm font-semibold">
                    {t.roleModuleElements.columns.moduleElementName}
                  </div>
                  <div className="col-span-6 text-sm font-semibold">
                    {t.roleModuleElements.columns.moduleName}
                  </div>
                </div>
                {field.state.value
                  ?.map((moduleElement, index) => (
                    <div
                      key={index}
                      className="col-span-1 rounded-md border border-foreground/30 p-2 md:col-span-2"
                    >
                      <div className="grid grid-cols-12">
                        <div className="col-span-5 text-sm">
                          {
                            moduleElements.find(
                              (x) =>
                                x.ModuleElementId ===
                                moduleElement.ModuleElementId,
                            )?.Name
                          }
                        </div>
                        <div className="col-span-6 text-sm">
                          {` ${
                            moduleElements.find(
                              (x) =>
                                x.ModuleElementId ===
                                moduleElement.ModuleElementId,
                            )?.ModuleName
                          } `}
                        </div>
                        <Icon
                          name="MdClose"
                          className="col-span-1 cursor-pointer place-self-center text-xl hover:text-primary"
                          onClick={() => field.removeValue(index)}
                        />
                      </div>
                    </div>
                  ))
                  .reverse()}
              </div>
            </div>
          )}
        />
      </div>
      {action !== "view" ? (
        <div className="flex justify-center space-x-3">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[30%]"
            onClick={() => router.back()}
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
    </form>
  );
}
