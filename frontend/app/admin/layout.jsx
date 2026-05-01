import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "the place from where you can buy the cloths of your choice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    {children}
  </>;
}
