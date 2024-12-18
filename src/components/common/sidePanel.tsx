// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// export function SidePanel({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline">Open</Button>
//       </SheetTrigger>
//       <SheetContent>{children}</SheetContent>
//     </Sheet>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function SidePanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>{children}</SheetContent>
    </Sheet>
  );
}
