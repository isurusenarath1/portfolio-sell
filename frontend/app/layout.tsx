import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getPortfolio } from "./services/api"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const portfolioData = await getPortfolio()
    const settings = portfolioData.settings

    return {
      title: settings?.tabName || "My Portfolio",
      description: portfolioData.hero?.subtitle || "A personal portfolio website",
      icons: {
        icon: settings?.tabImage || "/favicon.ico",
      },
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error)
    return {
      title: "My Portfolio",
      description: "A personal portfolio website",
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
