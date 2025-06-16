import ChangePassword from "@/components/studentProfile/changePassword";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function StudentsPage() {
  const t = frFR;
  const session = await auth();

  return (
    <main className="mt-6 flex w-full justify-center">
      <ChangePassword
        userId={session && session.user.userData.UserId}
        isModal
      />
    </main>
  );
}
