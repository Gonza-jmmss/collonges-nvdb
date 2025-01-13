export default function ModuleElementsLayout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return <main className="flex w-full justify-center">{children}</main>;
}
