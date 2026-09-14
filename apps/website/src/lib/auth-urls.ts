// Auth entry URLs for the marketing site. When NEXT_PUBLIC_USE_PHP_AUTH=1
// (live FTP build), hand off to php-auth's server-rendered pages instead of
// the client-side /login form that POSTs to services/backend (not hosted).

export const USE_PHP_AUTH = process.env.NEXT_PUBLIC_USE_PHP_AUTH === "1";

export const AUTH_LOGIN_HREF = USE_PHP_AUTH ? "/auth/login.php" : "/login/";
export const AUTH_REGISTER_HREF = USE_PHP_AUTH
  ? "/auth/register.php"
  : "/login/?mode=register";

/** Server-side Google OAuth start (php-auth). Only used when USE_PHP_AUTH. */
export const AUTH_GOOGLE_HREF = "/auth/google.php";
