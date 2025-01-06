"use client";

import { useState, useEffect } from "react";
import createRoleCommand from "@/repositories/roles/commands/createRoleCommand";
import updateRoleCommand from "@/repositories/roles/commands/updateRoleCommand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleViewModel } from "@/repositories/roles/rolesViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const RoleSchema = z.object({
  RoleId: z.number(),
  Name: z.string(),
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
  const [formData, setFormData] = useState<RoleFormData>({
    RoleId: 0,
    Name: "",
  });

  useEffect(() => {
    roleData &&
      setFormData((prevFormData) => ({
        ...prevFormData,
        RoleId: roleData.RoleId,
        Name: roleData.Name,
      }));
  }, []);

  const createRole = async () => {
    try {
      const response = await createRoleCommand(formData);

      if (!response) {
        throw new Error("Échec de la création du rôle");
      }
      toast({
        title: `Rôle créé avec succès`,
        description: `${t.roles.title} : ${response.Name}`,
      });

      router.refresh();
      router.push("/settings/roles", { scroll: false });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Une erreur s'est produite pendant la création du rôle`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateRole = async () => {
    try {
      const response = await updateRoleCommand(formData);

      if (!response) {
        throw new Error("Échec de la modification du rôle");
      }
      toast({
        title: `Rôle modifié avec succès`,
        description: `${t.roles.title} : ${response.Name}`,
      });

      router.push("/settings/roles");
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Une erreur s'est produite pendant la modification du rôle`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    action === "create" && createRole();
    action === "edit" && updateRole();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <div className="space-y-1">
        <span>{t.roles.form.name}</span>
        <Input
          id="Name"
          name="Name"
          placeholder={`${t.roles.form.name}`}
          className="w-full"
          onChange={handleChange}
          value={formData.Name}
          required
        />
      </div>
      {action !== "view" ? (
        <div className="flex justify-center space-x-3">
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
        <div className="flex justify-center space-x-3">
          <Button
            variant={"secondary"}
            className="w-[40%]"
            onClick={() => router.back()}
          >
            {t.shared.cancel}
          </Button>
        </div>
      )}
    </form>
  );
}
