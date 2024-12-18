"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import Breadcrumbs from "@/components/breadcrumbs";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar>
              <>
                <Breadcrumbs />
                {children}
                <Toaster />
              </>
            </Sidebar>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
