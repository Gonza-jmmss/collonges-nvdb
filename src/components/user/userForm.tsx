"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SwitchButton from "@/components/common/switchButton";
import Link from "next/link";
import enUS from "@/lang/en-US";

export default function UserForm() {
  const t = enUS;

  const [formData, setFormData] = useState({
    name: "",
    status: false,
  });
  return (
    <div>
      <form className="mt-10 grid w-full grid-cols-1 gap-3">
        {/* name imput */}
        <div className="w-full space-y-1">
          <span>{t.user.form.name}</span>
          <Input id="name" placeholder={t.user.form.name} className="w-full" />
          <span className="text-textSecundary text-xs">
            {t.user.form.nameDescription}
          </span>
        </div>
        {/* status switch */}
        <div className="flex h-fit w-full flex-col justify-center space-y-1 rounded-md border p-2">
          <span className="text-textPrimary font-medium">
            {t.user.form.status}
          </span>
          <SwitchButton
            id="status"
            variant="form"
            label={t.user.form.statusText}
            value={formData.status}
            onChange={setFormData}
          />
        </div>
        {/* buttons submit */}
        <div className="col-span-1 flex justify-center space-x-7">
          <Button className="mt-4 w-[20%]" variant="secondary">
            <Link href={"/users"}>{t.shared.cancel}</Link>
          </Button>
          <Button className="mt-4 w-[20%]">{t.shared.save}</Button>
        </div>
      </form>
    </div>
  );
}
