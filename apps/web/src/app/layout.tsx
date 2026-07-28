import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: "AURIX Web Platform",
    template: "%s | AURIX Web Platform",
  },
  description: "AURIX desktop dashboard — portfolio, transactions, statements, business, and partner/API management.",
};

// Receives a session handed off from the marketing site (apps/website)
// after login/register/Google sign-in there — localStorage is
// origin-scoped, so a plain redirect alone would land the user back on
// this app's own separate login page, signed out. The marketing site
// encodes {token, user} into a URL fragment (never sent to any server)
// on redirect; this runs before hydration so AuthProvider's first read
// already sees the session, then clears the fragment from the URL.
const sessionHandoffScript = `(function(){try{
  var hash = window.location.hash;
  if (hash.indexOf("#session=") === 0) {
    var encoded = hash.slice("#session=".length);
    var session = JSON.parse(atob(decodeURIComponent(encoded)));
    if (session && session.token && session.user) {
      localStorage.setItem("aurix.session", JSON.stringify(session));
    }
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: sessionHandoffScript }} />
      </head>
      <body className="flex min-h-full bg-[var(--color-paper)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
