import { Inter } from "next/font/google";
import './globals.css'
// import { Provider } from "react-redux";
// import store from "../redux/store.js";
import ReduxProvider from "../redux/ReduxProvider"; // import your custom components
// import Script from 'next/script';

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '600']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (
    <html lang="en">
      {/* <Provider store={store}> */}
      <body className={`${inter.className}`}>
        <ReduxProvider>
        {children}
        </ReduxProvider>
        {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" /> */}
      </body>
      {/* </Provider> */}
    </html>
  );
}
