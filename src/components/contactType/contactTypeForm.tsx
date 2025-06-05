"use client";

import { useState } from "react";
import createPersonContactTypeCommand from "@/repositories/personContactTypes/commands/createPersonContactTypeCommand";
import updatePersonContactTypeCommand from "@/repositories/personContactTypes/commands/updatePersonContactTypeCommand";
import { ContactTypeViewModel } from "@/repositories/personContactTypes/peronContactTypesViewModel";
import { ContactTypeSchema } from "@/zodSchemas/contactTypeSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type ContactTypeFormData = z.infer<typeof ContactTypeSchema>;

export default function ContactTypeForm({
  contactTypeData,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  contactTypeData: ContactTypeViewModel | null;
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ContactTypeViewModel>({
    defaultValues: {
      ContactTypeId:
        action !== "create" ? (contactTypeData?.ContactTypeId ?? 0) : 0,
      Name: action !== "create" ? (contactTypeData?.Name ?? "") : "",
    },
    onSubmit: async ({ value }) => {
      //   console.log("formData", value);
      setIsPending(true);
      action === "create" && createContactType(value);
      action === "edit" && updateContactType(value);
    },
  });

  const createContactType = async (formData: ContactTypeFormData) => {
    try {
      const response = await createPersonContactTypeCommand(formData);

      if (!response) {
        throw new Error(`${t.contactTypes.notifications.createFailure}`);
      }
      toast({
        title: `${t.contactTypes.notifications.createSuccess}`,
        description: `${t.contactTypes.title} : ${response?.Name}`,
      });

      router.push(
        `/students/contactTypes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.contactTypes.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateContactType = async (formData: ContactTypeFormData) => {
    try {
      const response = await updatePersonContactTypeCommand(formData);

      if (!response) {
        throw new Error(`${t.contactTypes.notifications.updateFailure}`);
      }
      toast({
        title: `${t.contactTypes.notifications.updateSuccess}`,
        description: `${t.contactTypes.title} : ${formData?.Name}`,
      });

      router.push(
        `/students/contactTypes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.contactTypes.notifications.updateError}`,
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
      className="mt-3 grid grid-cols-1 gap-5"
    >
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.contactTypes.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.contactTypes.form.name}`}
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
      <div className="col-span-1 md:col-span-2">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() =>
                router.push(
                  `/students/contactTypes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
                )
              }
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
              onClick={() =>
                router.push(
                  `/students/contactTypes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
                )
              }
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
