import * as IconsMD from "react-icons/md";

export default function Icon({
  name,
  className,
}: {
  name: keyof typeof IconsMD;
  className?: string;
}) {
  const IconComponent = IconsMD[name];
  return (
    <div className={className}>
      <IconComponent />
    </div>
  );
}
