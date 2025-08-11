import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import Breadcrumbs from "@/components/breadcrumbs";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/utils/auth";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

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
                <Breadcrumbs session={session} />
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
