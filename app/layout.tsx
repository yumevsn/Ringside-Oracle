import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ConvexClientProvider } from "@/lib/convex-provider"

export const metadata: Metadata = {
  title: "Ringside Oracle",
  description: "Wrestling Predictions Generator",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
