"use client";

import { useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { authenticate } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const LoginSchema = z.object({
  UserName: z.string(),
  Password: z.string(),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const t = frFR;
  const router = useRouter();

  const [isTransitionPending, startTransition] = useTransition();

  const [errorLogInMessage, setErrorLogInMessage] = useState<
    string | undefined
  >(undefined);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      UserName: "",
      Password: "",
    },
    // onSubmit: async ({ value }) => {
    //   setIsPending(true);
    //   setErrorLogInMessage(undefined);

    //   const formDataToSubmit = new FormData();
    //   formDataToSubmit.append("username", value.UserName);
    //   formDataToSubmit.append("password", value.Password);

    //   try {
    //     const result = await authenticate(undefined, formDataToSubmit);
    //     if (result) {
    //       setErrorLogInMessage(result);
    //     }
    //   } catch (error) {
    //     setErrorLogInMessage("An unexpected error occurred");
    //   } finally {
    //     setIsPending(false);
    //   }
    // },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setErrorLogInMessage(undefined);

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("username", value.UserName);
      formDataToSubmit.append("password", value.Password);

      try {
        const result = await authenticate(undefined, formDataToSubmit);
        if (result) {
          setErrorLogInMessage(result);
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        setErrorLogInMessage("An unexpected error occurred");
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col space-y-5"
    >
      <div className="flex items-center sm:px-5">
        <form.Field
          name="UserName"
          children={(field) => (
            <>
              <Icon
                name={
                  isValidIconName("MdPerson")
                    ? "MdPerson"
                    : "MdOutlineNotInterested"
                }
                className="text-xl"
              />
              <Input
                id="UserName"
                name="UserName"
                placeholder={`${t.login.user}`}
                variant="lined"
                className="w-full"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1 sm:px-5">
        <div className="flex items-center">
          <form.Field
            name="Password"
            children={(field) => (
              <>
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
                  type={showPassword ? "text" : "password"}
                  variant="lined"
                  className="w-full"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex items-center px-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  <Icon
                    name={
                      showPassword
                        ? isValidIconName("MdVisibilityOff")
                          ? "MdVisibilityOff"
                          : "MdOutlineNotInterested"
                        : isValidIconName("MdVisibility")
                          ? "MdVisibility"
                          : "MdOutlineNotInterested"
                    }
                    className="text-xl"
                  />
                </button>
              </>
            )}
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
