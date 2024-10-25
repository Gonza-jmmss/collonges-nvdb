import { Switch } from "@/components/ui/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export default function SwitchButton({
  id,
  label,
  value,
  variant,
  className,
  onChange,
}: {
  id: string;
  label?: string;
  value: boolean;
  variant?: "form" | "default" | null | undefined;
  className?: string;
  onChange: (value: any) => void;
}) {
  const switchStyle = cva("", {
    variants: {
      variant: {
        default: "flex space-x-3 items-center",
        form: "flex justify-between items-center text-textSecundary text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });
  return (
    <div className={cn(switchStyle({ variant, className }))}>
      {label && (
        <label htmlFor={id} className="hover:text-textPrimary cursor-pointer">
          {label}
        </label>
      )}
      <Switch id={id} checked={value} onCheckedChange={onChange} />
    </div>
  );
}
