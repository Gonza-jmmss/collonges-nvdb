"use client";

import { useState } from "react";
import createSidebarElementCommand from "@/repositories/sidebarElements/commands/createSidebarElementCommand";
import updateSidebarElementCommand from "@/repositories/sidebarElements/commands/updateSidebarElementCommand";
import { SidebarElementViewModel } from "@/repositories/sidebarElements/sidebarElementsViewModel";
import { ModuleViewModel } from "@/repositories/modules/modulesViewModel";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import isValidIconName from "@/functions/isValidIconName";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const SidebarElementSchema = z.object({
  SidebarElementId: z.number(),
  Name: z.string(),
  Path: z.string(),
  Icon: z.string(),
  Description: z.string(),
  ModuleId: z.number().nullable(),
  Location: z.number().nullable(),
});
type SidebarElementFormData = z.infer<typeof SidebarElementSchema>;

export default function SidebarElementForm({
  sidebarElementData,
  modules,
  action,
}: {
  sidebarElementData: SidebarElementViewModel | null;
  modules: ModuleViewModel[];
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<SidebarElementFormData>({
    defaultValues: {
      SidebarElementId:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.SidebarElementId
            : 0
          : 0,
      Name:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.Name
            : ""
          : "",
      Path:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.Path
            : ""
          : "",
      Icon:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.Icon
            : ""
          : "",
      Description:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.Description
            : ""
          : "",
      ModuleId:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.ModuleId
            : null
          : null,
      Location:
        action !== "create"
          ? sidebarElementData
            ? sidebarElementData.Location
            : null
          : null,
    },
    onSubmit: async ({ value }) => {
      action === "create" && createSidebarElement(value);
      action === "edit" && updateSidebarElement(value);
    },
  });

  const createSidebarElement = async (formData: SidebarElementFormData) => {
    try {
      const response = await createSidebarElementCommand(formData);

      if (!response) {
        throw new Error(`${t.sidebarElements.notifications.createFailure}`);
      }
      toast({
        title: `${t.sidebarElements.notifications.createSuccess}`,
        description: `${t.sidebarElements.title} : ${response.Name}`,
      });

      router.push("/settings/sidebarElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.sidebarElements.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateSidebarElement = async (formData: SidebarElementFormData) => {
    try {
      const response = await updateSidebarElementCommand(formData);

      if (!response) {
        throw new Error(`${t.sidebarElements.notifications.updateFailure}`);
      }
      toast({
        title: `${t.sidebarElements.notifications.updateSuccess}`,
        description: `${t.sidebarElements.title} : ${response.Name}`,
      });

      router.push("/settings/sidebarElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.sidebarElements.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

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
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.modules.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.modules.form.name}`}
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
      <div className="space-y-1">
        <form.Field
          name="Path"
          children={(field) => (
            <>
              <span>{t.modules.form.path}</span>
              <Input
                id="Path"
                name="Path"
                placeholder={`${t.modules.form.path}`}
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
      <div className="space-y-1">
        <form.Field
          name="Icon"
          validators={{
            onChange: ({ value }) => {
              if (!isValidIconName(value)) {
                return t.modules.validations.iconValidation;
              }
              return undefined;
            },
          }}
          children={(field) => (
            <>
              <span>{t.modules.form.icon}</span>
              <Input
                id="Icon"
                name="Icon"
                placeholder={`${t.modules.form.icon}`}
                className="w-full"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
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
          name="Description"
          children={(field) => (
            <>
              <span>{t.sidebarElements.form.description}</span>
              <Input
                id="Description"
                name="Description"
                placeholder={`${t.sidebarElements.form.description}`}
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
      <div className="space-y-1">
        <form.Field
          name="ModuleId"
          children={(field) => (
            <>
              <span>{t.sidebarElements.form.moduleId}</span>
              <Combobox
                options={modules}
                textAttribute="Name"
                valueAttribute="ModuleId"
                placeholder={t.sidebarElements.form.moduleId}
                itemSelected={modules.find(
                  (x) => x.ModuleId === field.state.value,
                )}
                setItemSelected={(x: { ModuleId: number; Name: string }) => {
                  field.handleChange(x && x.ModuleId);
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
          name="Location"
          children={(field) => (
            <>
              <span>{t.modules.form.location}</span>
              <Input
                id="Location"
                name="Location"
                placeholder={`${t.modules.form.location}`}
                className="w-full"
                type="number"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                disabled={action === "view"}
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
