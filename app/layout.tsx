import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "../src/theme/theme"
import "../styles/globals.css" // Import globals.css here

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "URL Shortener - Campus Hiring",
  description: "URL Shortener Web App for Campus Hiring Evaluation",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
