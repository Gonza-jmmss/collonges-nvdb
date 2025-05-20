"use client";

import { useState } from "react";
import updateUserPasswordCommand from "@/repositories/users/commands/updateUserPasswordCommand";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/modal";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const ChangePasswordSchema = z.object({
  UserId: z.number(),
  Password: z.string(),
  RepeatPassword: z.string(),
});

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword({
  openModal,
  closeModal,
  userId,
  isStudentProfile,
}: {
  openModal?: boolean;
  closeModal?: () => void;
  userId: number | null;
  isStudentProfile?: boolean;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    defaultValues: {
      UserId: userId || 0,
      Password: "",
      RepeatPassword: "",
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      updateUserPassword(value);
    },
  });

  const updateUserPassword = async (formData: ChangePasswordFormData) => {
    try {
      if (userId === null) {
        throw new Error(`${t.studentProfile.changePassword.nonUserError}`);
      }

      const response = await updateUserPasswordCommand(formData);

      if (!response) {
        throw new Error(`${t.users.notifications.updatePasswordFailure}`);
      }
      toast({
        title: `${t.users.notifications.updatePasswordSuccess}`,
        description: `${t.users.user} : ${response.UserName}`,
      });

      router.refresh();
      isStudentProfile ? closeModal && closeModal() : router.push(`/`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.users.notifications.updatePasswordError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {!isStudentProfile ? (
        <Modal
          openModal={openModal || false}
          closeModal={() => closeModal || setIsPending(false)}
        >
          <div className="text-xl font-semibold">
            {t.studentProfile.changePassword.title}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-3 flex flex-col space-y-5"
          >
            <div className="space-y-1">
              <form.Field
                name="Password"
                validators={{
                  onChange: z
                    .string()
                    .min(8, t.users.validations.passwordValidation),
                }}
                children={(field) => (
                  <>
                    <span>{t.users.form.password}</span>
                    <Input
                      id="Password"
                      name="Password"
                      placeholder={`${t.users.form.password}`}
                      type="password"
                      className="w-full"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required={true}
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
                name="RepeatPassword"
                validators={{
                  onChangeListenTo: ["Password"],
                  onChange: ({ value, fieldApi }) => {
                    if (value !== fieldApi.form.getFieldValue("Password")) {
                      return t.users.validations.repeatPasswordValidation;
                    }
                    return undefined;
                  },
                }}
                children={(field) => (
                  <>
                    <span>{t.users.form.repeatePassword}</span>
                    <Input
                      id="RepeatPassword"
                      name="RepeatPassword"
                      placeholder={`${t.users.form.repeatePassword}`}
                      type="password"
                      className="w-full"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required={true}
                    />
                    <div className="text-xs text-red-500">
                      {field.state.meta.errors}
                    </div>
                  </>
                )}
              />
            </div>
            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant={"secondary"}
                className="w-[40%]"
                onClick={closeModal}
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
          </form>
        </Modal>
      ) : (
        <>
          <div className="mt-10 w-[90vw]">
            <div className="text-xl font-semibold">
              {t.studentProfile.changePassword.title}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="mt-3 flex flex-col space-y-5"
            >
              <div className="space-y-1">
                <form.Field
                  name="Password"
                  validators={{
                    onChange: z
                      .string()
                      .min(8, t.users.validations.passwordValidation),
                  }}
                  children={(field) => (
                    <>
                      <span>{t.users.form.password}</span>
                      <Input
                        id="Password"
                        name="Password"
                        placeholder={`${t.users.form.password}`}
                        type="password"
                        className="w-full"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required={true}
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
                  name="RepeatPassword"
                  validators={{
                    onChangeListenTo: ["Password"],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue("Password")) {
                        return t.users.validations.repeatPasswordValidation;
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <span>{t.users.form.repeatePassword}</span>
                      <Input
                        id="RepeatPassword"
                        name="RepeatPassword"
                        placeholder={`${t.users.form.repeatePassword}`}
                        type="password"
                        className="w-full"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required={true}
                      />
                      <div className="text-xs text-red-500">
                        {field.state.meta.errors}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="flex justify-center space-x-3">
                <Button
                  type="button"
                  variant={"secondary"}
                  className="w-[40%]"
                  onClick={() => closeModal || router.push(`/`)}
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
            </form>
          </div>
        </>
      )}
    </>
  );
}
