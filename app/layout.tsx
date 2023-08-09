import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'
import { Inter } from 'next/font/google'

import Mainbar from "./components/navigation/mainbar";
import Sidebar from "./components/navigation/sidebar";

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
      <body className={inter.className}>
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <Mainbar />
            <div className="container-fluid">{children}</div>
          </div>
        </div>
      </body>
    </html>
  )
}
