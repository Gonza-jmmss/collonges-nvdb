import LoginForm from "@/components/login";
import frFR from "@/lang/fr-FR";

export default function LoginPage() {
  const t = frFR;
  return (
    // <main className="flex h-[90vh] w-[90vw] items-center justify-center">
    <main className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-background">
      {/* <div className="p-5"></div> */}
      <div className="flex h-[20rem] w-[30vw] flex-col justify-center space-y-7 rounded-md border bg-muted/50 p-3 shadow">
        <div className="flex w-full justify-center">
          <span className="text-2xl">{t.shared.login}</span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
