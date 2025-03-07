export default function LevelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full justify-center">
      <div>{children}</div>
    </main>
  );
}
