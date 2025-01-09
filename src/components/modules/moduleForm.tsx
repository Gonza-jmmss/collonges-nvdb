"use client";

import { useState } from "react";
import createModuleCommand from "@/repositories/modules/commands/createModuleCommand";
import updateModuleCommand from "@/repositories/modules/commands/updateModuleCommand";
import { ModuleViewModel } from "@/repositories/modules/modulesViewModel";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import isValidIconName from "@/functions/isValidIconName";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const ModuleSchema = z.object({
  ModuleId: z.number(),
  Name: z.string(),
  Path: z.string(),
  Icon: z.string(),
  Location: z.number().nullable(),
});
type ModuleFormData = z.infer<typeof ModuleSchema>;

export default function ModuleForm({
  moduleData,
  action,
}: {
  moduleData: ModuleViewModel | null;
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ModuleFormData>({
    defaultValues: {
      ModuleId:
        action !== "create" ? (moduleData ? moduleData.ModuleId : 0) : 0,
      Name: action !== "create" ? (moduleData ? moduleData.Name : "") : "",
      Path: action !== "create" ? (moduleData ? moduleData.Path : "") : "",
      Icon: action !== "create" ? (moduleData ? moduleData.Icon : "") : "",
      Location:
        action !== "create" ? (moduleData ? moduleData.Location : null) : null,
    },
    onSubmit: async ({ value }) => {
      action === "create" && createModule(value);
      action === "edit" && updateModule(value);
    },
  });

  const createModule = async (formData: ModuleFormData) => {
    try {
      const response = await createModuleCommand(formData);

      if (!response) {
        throw new Error(`${t.modules.notifications.createFailure}`);
      }
      toast({
        title: `${t.modules.notifications.createSuccess}`,
        description: `${t.modules.title} : ${response.Name}`,
      });

      router.push("/settings/modules");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.modules.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateModule = async (formData: ModuleFormData) => {
    try {
      const response = await updateModuleCommand(formData);

      if (!response) {
        throw new Error(`${t.modules.notifications.updateFailure}`);
      }
      toast({
        title: `${t.modules.notifications.updateSuccess}`,
        description: `${t.modules.title} : ${response.Name}`,
      });

      router.push("/settings/modules");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.modules.notifications.updateError}`,
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
              console.log("isValidIconName", !isValidIconName(value));
              console.log("value", value);
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
