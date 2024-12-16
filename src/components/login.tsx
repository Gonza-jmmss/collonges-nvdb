"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/lib/actions";

type LoginFormData = {
  userName: string;
  password: string;
};

export default function LoginForm() {
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
      <div>
        <span>User :</span>
        <Input
          id="userName"
          name="userName"
          placeholder="User name"
          className="w-full"
          onChange={handleChange}
          value={formData.userName}
        />
      </div>
      <div>
        <span>Password :</span>
        <Input
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          className="w-full"
          onChange={handleChange}
          value={formData.password}
        />
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          variant={"secondary"}
          className="w-[40%]"
          disabled={isPending}
        >
          Login
        </Button>
      </div>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorLogInMessage && (
          <p className="text-sm text-red-500">{errorLogInMessage}</p>
        )}
      </div>
    </form>
  );
}
