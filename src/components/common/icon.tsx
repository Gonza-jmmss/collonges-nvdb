import * as IconsMD from "react-icons/md";

export default function Icon({
  name,
  className,
  onClick,
}: {
  name: keyof typeof IconsMD;
  className?: string;
  onClick?: () => void;
}) {
  const IconComponent = IconsMD[name];
  return (
    <div className={className} onClick={onClick}>
      <IconComponent />
    </div>
  );
}
