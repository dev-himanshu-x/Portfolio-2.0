import type { Metadata } from "next";
import {
  Anton,
  Bricolage_Grotesque,
  DM_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SITE } from "@/content/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const outline = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-outline",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script must run before first paint
          dangerouslySetInnerHTML={{
            __html:
              'history.scrollRestoration="manual";try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type!=="navigate"&&+sessionStorage.getItem("scrollY")>0)document.documentElement.classList.add("booting")}catch(e){}',
          }}
        />
      </head>
      <body
        className={`${display.variable} ${outline.variable} ${body.variable} ${mono.variable}`}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
