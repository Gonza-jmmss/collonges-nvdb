// import { LucideProps } from "lucide-react";
// import dynamicIconImports from "lucide-react/dynamicIconImports";
// import { useEffect, useState } from "react";

// interface IconProps extends LucideProps {
//   name: keyof typeof dynamicIconImports;
// }

// const Icon = ({ name, ...props }: IconProps) => {
//   const [LucideIcon, setLucideIcon] = useState<React.ComponentType<LucideProps> | null>(null);

//   useEffect(() => {
//     if (name) {
//       const importIcon = async () => {
//         const IconComponent = await dynamicIconImports[name]();
//         setLucideIcon(() => IconComponent.default || IconComponent);
//       };

//       importIcon();
//     }
//   }, [name]);

//   if (!LucideIcon) return null;

//   return <LucideIcon {...props} />;
// };

// export default Icon;

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