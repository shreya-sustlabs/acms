import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SustLabs ACMS",
  description: "Advanced Content Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <div className="brand">REY</div>
          <div className="brand">ACMS DASHBOARD</div>
          <nav>
            {/* Placeholder for future nav */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div><img src="https://sustlabs-emc.web.app/assets/images/logo/logo.svg" alt="" /></div>
              <div className="brand">SustLabs</div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
