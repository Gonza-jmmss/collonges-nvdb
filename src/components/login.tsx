"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { authenticate } from "@/lib/actions";
import frFR from "@/lang/fr-FR";

type LoginFormData = {
  userName: string;
  password: string;
};

export default function LoginForm() {
  const t = frFR;
  const [errorLogInMessage, setErrorLogInMessage] = useState<
    string | undefined
  >(undefined);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    userName: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    errorLogInMessage && setErrorLogInMessage(undefined);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorLogInMessage(undefined);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("username", formData.userName);
    formDataToSubmit.append("password", formData.password);

    try {
      const result = await authenticate(undefined, formDataToSubmit);
      if (result) {
        setErrorLogInMessage(result);
      }
    } catch (error) {
      setErrorLogInMessage("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <div className="flex items-center">
        <Icon
          name={
            isValidIconName("MdPerson") ? "MdPerson" : "MdOutlineNotInterested"
          }
          className="text-xl"
        />
        <Input
          id="userName"
          name="userName"
          placeholder={`${t.login.user}`}
          variant="lined"
          className="w-full"
          onChange={handleChange}
          value={formData.userName}
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center">
          <Icon
            name={
              isValidIconName("MdPassword")
                ? "MdPassword"
                : "MdOutlineNotInterested"
            }
            className="text-xl"
          />
          <Input
            id="password"
            name="password"
            placeholder={`${t.login.password}`}
            type="password"
            variant="lined"
            className="w-full"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
        <div
          className="flex h-5 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorLogInMessage && (
            <p className="text-sm text-red-500">{errorLogInMessage}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          variant={"secondary"}
          className="w-[40%]"
          disabled={isPending}
        >
          {t.shared.login}
        </Button>
      </div>
    </form>
  );
}
