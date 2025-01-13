"use client";

import { useEffect, useState } from "react";
import createRoleSidebarElementCommand from "@/repositories/roleSidebarElements/commands/createRoleSidebarElementCommand";
import updateRoleSidebarElementCommand from "@/repositories/roleSidebarElements/commands/updateRoleSidebarElementCommand";
import { RoleSidebarElementViewModel } from "@/repositories/roleSidebarElements/roleSidebarElementsViewModel";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { SidebarElementsViewModel } from "@/repositories/sidebarElements/sidebarElementsViewModel";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import { Field, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const RoleSidebarElementSchema = z.object({
  RoleSidebarElementId: z.number(),
  SidebarElementId: z.number().nullable(),
  ModuleId: z.number().nullable(),
  RoleId: z.number(),
});
type RoleSidebarElementFormData = z.infer<typeof RoleSidebarElementSchema>;

export default function RoleSidebarElementForm({
  roleSidebarElementData,
  modules,
  sidebarElements,
  roles,
  action,
}: {
  roleSidebarElementData: RoleSidebarElementViewModel | null;
  modules: ModulesViewModel[];
  sidebarElements: SidebarElementsViewModel[];
  roles: RolesViewModel[];
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<RoleSidebarElementFormData>({
    defaultValues: {
      RoleSidebarElementId:
        action !== "create"
          ? roleSidebarElementData
            ? roleSidebarElementData.RoleSidebarElementId
            : 0
          : 0,
      SidebarElementId:
        action !== "create"
          ? roleSidebarElementData
            ? roleSidebarElementData.SidebarElementId
            : null
          : null,
      ModuleId:
        action !== "create"
          ? roleSidebarElementData
            ? roleSidebarElementData.ModuleId
            : null
          : null,
      RoleId:
        action !== "create"
          ? roleSidebarElementData
            ? roleSidebarElementData.RoleId
            : 0
          : 0,
    },
    onSubmit: async ({ value }) => {
      // console.log("form", value);
      action === "create" && createRoleSidebarElement(value);
      action === "edit" && updateRoleSidebarElement(value);
    },
  });

  const createRoleSidebarElement = async (
    formData: RoleSidebarElementFormData,
  ) => {
    try {
      const response = await createRoleSidebarElementCommand(formData);

      if (!response) {
        throw new Error(`${t.roleSidebarElements.notifications.createFailure}`);
      }
      toast({
        title: `${t.roleSidebarElements.notifications.createSuccess}`,
        description: `${t.roleSidebarElements.title} : ${response.ModuleId !== null && response.ModuleId}${response.SidebarElementId !== null && response.SidebarElementId}-${response.RoleId}`,
      });

      router.push("/settings/roleSidebarElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleSidebarElements.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateRoleSidebarElement = async (
    formData: RoleSidebarElementFormData,
  ) => {
    try {
      const response = await updateRoleSidebarElementCommand(formData);

      if (!response) {
        throw new Error(`${t.roleSidebarElements.notifications.updateFailure}`);
      }
      toast({
        title: `${t.roleSidebarElements.notifications.updateSuccess}`,
        description: `${t.roleSidebarElements.title} : ${response.ModuleId !== null && response.ModuleId}${response.SidebarElementId !== null && response.SidebarElementId}-${response.RoleId}`,
      });

      router.push("/settings/roleSidebarElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleSidebarElements.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const elementType = [
    { Name: t.sidebarElements.title, Value: 1 },
    { Name: t.modules.title, Value: 2 },
  ];
  const [elementTypeSelected, setElementTypeSelected] = useState({
    Name: "",
    Value: 0,
  });

  useEffect(() => {
    form.setFieldValue("ModuleId", null);
    form.setFieldValue("SidebarElementId", null);
  }, [elementTypeSelected]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col space-y-5"
    >
      <div className="space-y-1">
        <span>{t.roleSidebarElements.form.chooseElementType}</span>
        <Combobox
          options={elementType}
          textAttribute="Name"
          valueAttribute="ModuleId"
          placeholder={t.roleSidebarElements.form.chooseElementType}
          itemSelected={elementType.find(
            (x) => x.Value === elementTypeSelected.Value,
          )}
          setItemSelected={(x: { Value: number; Name: string }) => {
            setElementTypeSelected(x);
          }}
          disabled={action === "view"}
          showSearch
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="SidebarElementId"
          children={(field) => (
            <>
              <span
                className={`${elementTypeSelected.Name !== t.sidebarElements.title ? "text-neutral-500" : ""}`}
              >
                {t.roleSidebarElements.form.sidebarElementId}
              </span>
              <Combobox
                options={sidebarElements}
                textAttribute="Name"
                valueAttribute="SidebarElementId"
                placeholder={t.roleSidebarElements.form.sidebarElementId}
                itemSelected={sidebarElements.find(
                  (x) => x.SidebarElementId === field.state.value,
                )}
                setItemSelected={(x: {
                  SidebarElementId: number;
                  Name: string;
                }) => {
                  field.handleChange(x && x.SidebarElementId);
                }}
                // disabled={action === "view"}
                disabled={
                  action === "view" ||
                  elementTypeSelected.Name !== t.sidebarElements.title
                }
                showSearch
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="ModuleId"
          children={(field) => (
            <>
              <span
                className={`${elementTypeSelected.Name !== t.modules.title ? "text-neutral-500" : ""}`}
              >
                {t.roleSidebarElements.form.moduleId}
              </span>
              <Combobox
                options={modules}
                textAttribute="Name"
                valueAttribute="ModuleId"
                placeholder={t.roleSidebarElements.form.moduleId}
                itemSelected={modules.find(
                  (x) => x.ModuleId === field.state.value,
                )}
                setItemSelected={(x: { ModuleId: number; Name: string }) => {
                  field.handleChange(x && x.ModuleId);
                }}
                // disabled={action === "view"}
                disabled={
                  action === "view" ||
                  elementTypeSelected.Name !== t.modules.title
                }
                showSearch
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="RoleId"
          children={(field) => (
            <>
              <span>{t.roleSidebarElements.form.roleId}</span>
              <Combobox
                options={roles}
                textAttribute="Name"
                valueAttribute="RoleId"
                placeholder={t.roleSidebarElements.form.roleId}
                itemSelected={roles.find((x) => x.RoleId === field.state.value)}
                setItemSelected={(x: { RoleId: number; Name: string }) => {
                  field.handleChange(x && x.RoleId);
                }}
                disabled={action === "view"}
                showSearch
              />
            </>
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
