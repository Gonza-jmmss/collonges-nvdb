"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UpdateEvent = { [key: string]: string }; // Define el tipo para los filtros

export const useUpdateQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (e: UpdateEvent) => {
    // Crear una nueva URL basada en el pathname actual, pero sin los parámetros actuales
    const newUrl = new URL(
      pathname, // Solo se usa el pathname sin los parámetros de búsqueda existentes
      process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
    );

    // Agregar el nuevo filtro (un solo filtro)
    Object.entries(e).map((param) => {
      if (param[1]) newUrl.searchParams.set(param[0], param[1]);
    });

    // Actualizar la ruta con el nuevo filtro, sin hacer scroll
    router.push(newUrl.pathname + newUrl.search, { scroll: false });
  };
};
