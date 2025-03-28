"use client";

import { useEffect, useState } from "react";
import createRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/createRoleModuleElementCommand";
import updateRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/updateRoleModuleElementCommand";
import { RoleModuleElementViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { ModuleElementsViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const RoleModuleElementSchema = z.object({
  RoleModuleElementId: z.number(),
  ModuleElementId: z.number().nullable(),
  ModuleId: z.number().nullable(),
  RoleId: z.number(),
});
type RoleModuleElementFormData = z.infer<typeof RoleModuleElementSchema>;

export default function RoleModuleElementForm({
  roleModuleElementData,
  modules,
  moduleElements,
  roles,
  action,
}: {
  roleModuleElementData: RoleModuleElementViewModel | null;
  modules: ModulesViewModel[];
  moduleElements: ModuleElementsViewModel[];
  roles: RolesViewModel[];
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<RoleModuleElementFormData>({
    defaultValues: {
      RoleModuleElementId:
        action !== "create"
          ? roleModuleElementData
            ? roleModuleElementData.RoleModuleElementId
            : 0
          : 0,
      ModuleElementId:
        action !== "create"
          ? roleModuleElementData
            ? roleModuleElementData.ModuleElementId
            : null
          : null,
      ModuleId:
        action !== "create"
          ? roleModuleElementData
            ? roleModuleElementData.ModuleId
            : null
          : null,
      RoleId:
        action !== "create"
          ? roleModuleElementData
            ? roleModuleElementData.RoleId
            : 0
          : 0,
    },
    onSubmit: async ({ value }) => {
      // console.log("form", value);
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
        description: `${t.roleModuleElements.title} : ${response.ModuleId !== null ? response.ModuleId : ""}${response.ModuleElementId !== null ? response.ModuleElementId : ""}-${response.RoleId}`,
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
        description: `${t.roleModuleElements.title} : ${response.ModuleId !== null ? response.ModuleId : ""}${response.ModuleElementId !== null ? response.ModuleElementId : ""}-${response.RoleId}`,
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

  const elementType = [
    { Name: t.moduleElements.title, Value: 1 },
    { Name: t.modules.title, Value: 2 },
  ];
  const [elementTypeSelected, setElementTypeSelected] = useState({
    Name: "",
    Value: 0,
  });

  useEffect(() => {
    form.setFieldValue("ModuleId", null);
    form.setFieldValue("ModuleElementId", null);
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
        <span>{t.roleModuleElements.form.chooseElementType}</span>
        <Combobox
          options={elementType}
          textAttribute="Name"
          valueAttribute="Value"
          placeholder={t.roleModuleElements.form.chooseElementType}
          itemSelected={elementType.find(
            (x) => x.Value === elementTypeSelected.Value,
          )}
          setItemSelected={(x: { Name: string; Value: number }) => {
            setElementTypeSelected(x);
          }}
          disabled={action === "view"}
          showSearch
          notClearable
        />
      </div>
      {elementTypeSelected.Value === 1 ? (
        <div className="space-y-1">
          <form.Field
            name="ModuleElementId"
            children={(field) => (
              <>
                <span
                  className={`${elementTypeSelected.Name !== t.moduleElements.title ? "text-neutral-500" : ""}`}
                >
                  {t.roleModuleElements.form.moduleElementId}
                </span>
                <Combobox
                  options={moduleElements}
                  textAttribute="Name"
                  valueAttribute="ModuleElementId"
                  placeholder={t.roleModuleElements.form.moduleElementId}
                  itemSelected={moduleElements.find(
                    (x) => x.ModuleElementId === field.state.value,
                  )}
                  setItemSelected={(x: {
                    ModuleElementId: number;
                    Name: string;
                  }) => {
                    field.handleChange(x && x.ModuleElementId);
                  }}
                  // disabled={action === "view"}
                  disabled={
                    action === "view" ||
                    elementTypeSelected.Name !== t.moduleElements.title
                  }
                  showSearch
                />
              </>
            )}
          />
        </div>
      ) : (
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
      )}
      <div className="space-y-1">
        <form.Field
          name="RoleId"
          children={(field) => (
            <>
              <span>{t.roleModuleElements.form.roleId}</span>
              <Combobox
                options={roles}
                textAttribute="Name"
                valueAttribute="RoleId"
                placeholder={t.roleModuleElements.form.roleId}
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
