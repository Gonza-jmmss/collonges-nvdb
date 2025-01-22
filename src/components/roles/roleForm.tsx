"use client";

import { useState } from "react";
import createRoleCommand from "@/repositories/roles/commands/createRoleCommand";
import updateRoleCommand from "@/repositories/roles/commands/updateRoleCommand";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToggleButton from "@/components/common/toggleButton";
import { RoleViewModel } from "@/repositories/roles/rolesViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const RoleSchema = z.object({
  RoleId: z.number(),
  Name: z.string(),
  IsEnabled: z.boolean(),
});

type RoleFormData = z.infer<typeof RoleSchema>;

export default function RoleForm({
  roleData,
  action,
}: {
  roleData: RoleViewModel | null;
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<RoleFormData>({
    defaultValues: {
      RoleId: action !== "create" ? (roleData ? roleData.RoleId : 0) : 0,
      Name: action !== "create" ? (roleData ? roleData.Name : "") : "",
      IsEnabled:
        action !== "create" ? (roleData ? roleData.IsEnabled : true) : true,
    },
    onSubmit: async ({ value }) => {
      action === "create" && createRole(value);
      action === "edit" && updateRole(value);
    },
  });

  const createRole = async (formData: RoleFormData) => {
    try {
      const response = await createRoleCommand(formData);

      if (!response) {
        throw new Error(`${t.roles.notifications.createFailure}`);
      }
      toast({
        title: `${t.roles.notifications.createSuccess}`,
        description: `${t.roles.title} : ${response.Name}`,
      });

      router.push("/settings/roles");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roles.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateRole = async (formData: RoleFormData) => {
    try {
      const response = await updateRoleCommand(formData);

      if (!response) {
        throw new Error(`${t.roles.notifications.updateFailure}`);
      }
      toast({
        title: `${t.roles.notifications.updateSuccess}`,
        description: `${t.roles.title} : ${response.Name}`,
      });

      router.push("/settings/roles");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roles.notifications.updateError}`,
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
              <span>{t.roles.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.roles.form.name}`}
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
          name="IsEnabled"
          children={(field) => (
            <>
              <span>{t.roles.form.isEnabled}</span>
              <ToggleButton
                options={[
                  { key: false, value: t.shared.no },
                  { key: true, value: t.shared.yes },
                ]}
                setItemSelected={(x: { key: boolean; value: string }) => {
                  field.handleChange(x && x.key);
                }}
                itemSelected={field.state.value}
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
