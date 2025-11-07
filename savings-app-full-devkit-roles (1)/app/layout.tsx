import "./globals.css";
import type { Metadata } from "next";
import AuthLinks from "@/components/AuthLinks";
export const metadata: Metadata = { title: "52-Week Savings", description: "Simple mobile-first savings planner" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <header className="border-b bg-white"><div className="container py-3 flex items-center justify-between gap-4">
      <a href="/" className="text-lg font-semibold">52-Week Savings</a>
      <nav className="flex items-center gap-4 text-sm">
        <a className="underline" href="/plan">Plan</a>
        <a className="underline" href="/notifications">Notifications</a>
        <a className="underline" href="/settings">Settings</a>
        <a className="underline" href="/admin">Admin</a>
        <a className="underline" href="/api/export/csv">Export CSV</a>
        <AuthLinks/>
      </nav></div></header>
    <main className="container py-6">{children}</main>
    <footer className="container py-8 text-xs text-gray-500">© {new Date().getFullYear()} 52-Week Savings</footer>
  </body></html>);
}
