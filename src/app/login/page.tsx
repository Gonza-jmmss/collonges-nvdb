import LoginForm from "@/components/login";

export default function LoginPage() {
  return (
    // <main className="flex h-[90vh] w-[90vw] items-center justify-center">
    <main className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black">
      <div className="p-5"></div>
      <div className="w-[30vw] space-y-5 rounded-md border bg-muted/50 p-3">
        <span className="text-2xl">Login</span>
        <LoginForm />
      </div>
    </main>
  );
}
