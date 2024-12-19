"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import { UserViewModel } from "@/repositories/users/usersViewModel";
import { RoleViewModel } from "@/repositories/roles/rolesViewModel";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const UserSchema = z
  .object({
    UserName: z.string(),
    Password: z.string().min(8),
    RepeatPassword: z.string().min(8),
    RoleId: z.number().nullable(),
  })
  .refine((data) => data.Password === data.RepeatPassword, {
    message: `Les mots de passe ne correspondent pas`,
    path: ["RepeatPassword"],
  });

type UserFormData = z.infer<typeof UserSchema>;

export default function UserForm({
  userData,
  action,
  roles,
}: {
  userData: UserViewModel | null;
  action: string;
  roles: RoleViewModel[];
}) {
  const t = frFR;
  const router = useRouter();

  const [errorLogInMessage, setErrorLogInMessage] = useState<
    string | undefined
  >(undefined);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    UserName: "",
    Password: "",
    RepeatPassword: "",
    RoleId: null,
  });

  useEffect(() => {
    userData &&
      setFormData((prevFormData) => ({
        ...prevFormData,
        UserId: userData.UserId,
        UserName: userData.UserName,
      }));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    errorLogInMessage && setErrorLogInMessage(undefined);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle all the NONE raw <input> fields
  const handleExternal = (values: { name: string; value: number }) => {
    console.log("handleExternal", values);
    const { name, value } = values;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorLogInMessage(undefined);
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      {action !== "password" && (
        <>
          <div className="space-y-1">
            <span>{t.users.form.userName}</span>
            <Input
              id="UserName"
              name="UserName"
              placeholder={`${t.users.form.userName}`}
              className="w-full"
              onChange={handleChange}
              value={formData.UserName}
            />
          </div>
          <div className="space-y-1">
            <span>{t.users.form.role}</span>
            <Combobox
              options={roles}
              textAttribute="Name"
              valueAttribute="RoleId"
              placeholder={t.users.form.role}
              itemSelected={roles.find((x) => x.RoleId === formData.RoleId)}
              setItemSelected={(x: { RoleId: number; Name: string }) => {
                handleExternal({
                  name: "RoleId",
                  value: x && x.RoleId,
                });
              }}
              showSearch
            />
          </div>
        </>
      )}
      {(action === "password" || action === "create") && (
        <>
          <div className="space-y-1">
            <span>{t.users.form.password}</span>
            <Input
              id="Password"
              name="Password"
              placeholder={`${t.users.form.password}`}
              type="password"
              className="w-full"
              onChange={handleChange}
              value={formData.Password}
            />
          </div>
          <div className="space-y-1">
            <span>{t.users.form.repeatePassword}</span>
            <Input
              id="RepeatPassword"
              name="RepeatPassword"
              placeholder={`${t.users.form.repeatePassword}`}
              type="password"
              className="w-full"
              onChange={handleChange}
              value={formData.RepeatPassword}
            />
          </div>
        </>
      )}
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
