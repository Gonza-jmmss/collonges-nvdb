import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import Breadcrumbs from "@/components/breadcrumbs";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-auto">
      <body className={inter.className}>
        {/* <SessionProvider
          refetchInterval={5 * 60}
          refetchOnWindowFocus={true}
        > */}
        <SessionProvider>
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
