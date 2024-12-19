export default function UsersLayout({
  children,
  sidePanel,
}: {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full justify-center">
      <div>
        {children}
        {sidePanel}
      </div>
    </main>
  );
}
