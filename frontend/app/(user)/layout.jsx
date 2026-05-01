import type { Metadata } from "next";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "the place from where you can buy the cloths of your choice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster position="top-right" />
      <Header />
      {children}
      <Footer />
    </>
  );
}
