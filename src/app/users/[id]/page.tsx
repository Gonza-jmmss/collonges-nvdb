import enUS from "@/lang/en-US";
import UserForm from "@/components/user/userForm";

export default function UserIdPage() {
  const t = enUS;

  return (
    <main className="mt-6">
      <div className="w-[80vw]">
        <span className="flex justify-center text-2xl font-bold">
          User Form
        </span>
        <UserForm />
      </div>
    </main>
  );
}
