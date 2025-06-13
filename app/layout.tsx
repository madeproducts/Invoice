import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Madeproducts Invoice',
  description: 'Created by Abhin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
