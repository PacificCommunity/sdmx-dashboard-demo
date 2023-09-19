import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'
import { Inter } from 'next/font/google'

import Offbar from "./components/navigation/offbar";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard creator',
  description: 'NextJS dashboard creator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light`}>
        <Offbar />
        <div id="page-content-wrapper">
          <div className="container-fluid mt-5 mt-sm-0">{children}</div>
        </div>
      </body>
    </html>
  )
}
