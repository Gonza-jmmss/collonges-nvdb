export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full justify-center">
      <div>{children}</div>
    </main>
  );
}
