export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full justify-center">
      <div>
        {/* <span>Users</span> */}
        {children}
      </div>
    </main>
  );
}
