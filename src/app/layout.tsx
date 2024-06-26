import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next project",
  description: "this my first project in next js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <ToastContainer theme="colored" position="top-center" autoClose={2000} />
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
