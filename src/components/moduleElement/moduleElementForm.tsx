"use client";

import { useState } from "react";
import createModuleElementCommand from "@/repositories/moduleElements/commands/createModuleElementCommand";
import updateModuleElementCommand from "@/repositories/moduleElements/commands/updateModuleElementCommand";
import { ModuleElementViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
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

const ModuleElementSchema = z.object({
  ModuleElementId: z.number(),
  Name: z.string(),
  Path: z.string(),
  Icon: z.string(),
  Description: z.string(),
  ModuleId: z.number().nullable(),
  Location: z.number().nullable(),
});
type ModuleElementFormData = z.infer<typeof ModuleElementSchema>;

export default function ModuleElementForm({
  moduleElementData,
  modules,
  action,
}: {
  moduleElementData: ModuleElementViewModel | null;
  modules: ModuleViewModel[];
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ModuleElementFormData>({
    defaultValues: {
      ModuleElementId:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.ModuleElementId
            : 0
          : 0,
      Name:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.Name
            : ""
          : "",
      Path:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.Path
            : ""
          : "",
      Icon:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.Icon
            : ""
          : "",
      Description:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.Description
            : ""
          : "",
      ModuleId:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.ModuleId
            : null
          : null,
      Location:
        action !== "create"
          ? moduleElementData
            ? moduleElementData.Location
            : null
          : null,
    },
    onSubmit: async ({ value }) => {
      action === "create" && createModuleElement(value);
      action === "edit" && updateModuleElement(value);
    },
  });

  const createModuleElement = async (formData: ModuleElementFormData) => {
    try {
      const response = await createModuleElementCommand(formData);

      if (!response) {
        throw new Error(`${t.moduleElements.notifications.createFailure}`);
      }
      toast({
        title: `${t.moduleElements.notifications.createSuccess}`,
        description: `${t.moduleElements.title} : ${response.Name}`,
      });

      router.push("/settings/moduleElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.moduleElements.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateModuleElement = async (formData: ModuleElementFormData) => {
    try {
      const response = await updateModuleElementCommand(formData);

      if (!response) {
        throw new Error(`${t.moduleElements.notifications.updateFailure}`);
      }
      toast({
        title: `${t.moduleElements.notifications.updateSuccess}`,
        description: `${t.moduleElements.title} : ${response.Name}`,
      });

      router.push("/settings/moduleElements");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.moduleElements.notifications.updateError}`,
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
              <span>{t.moduleElements.form.description}</span>
              <Input
                id="Description"
                name="Description"
                placeholder={`${t.moduleElements.form.description}`}
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
              <span>{t.moduleElements.form.moduleId}</span>
              <Combobox
                options={modules}
                textAttribute="Name"
                valueAttribute="ModuleId"
                placeholder={t.moduleElements.form.moduleId}
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
