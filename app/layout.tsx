import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import MyFallbackComponent from "@/components/shared/ErrorBoundary";
import NavBar from "@/components/shared/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connected",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ConvexClientProvider>
            <TooltipProvider>
              <ErrorBoundary fallbackRender={MyFallbackComponent}>
                <NavBar />
                <div className="h-[calc(100vh-56px)] p-2 relative top-14">
                  {children}
                </div>
              </ErrorBoundary>
            </TooltipProvider>
            <Toaster richColors/>
          </ConvexClientProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
