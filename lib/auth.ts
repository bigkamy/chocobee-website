import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AdminRole } from "./permissions";
import { getAdminEmail, verifyAdminLogin } from "./admin-credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // This site stores its content in data/cms.json (no database). The single
        // admin account is configured via ADMIN_EMAIL/ADMIN_PASSWORD and can be
        // changed through the password-reset flow (stored in data/admin-auth.json).
        const isValid = await verifyAdminLogin(credentials.email, credentials.password);
        if (!isValid) return null;

        return {
          id: "admin",
          name: "Chocobee Admin",
          email: getAdminEmail(),
          role: "ADMIN" as AdminRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: AdminRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as AdminRole;
      }
      return session;
    },
  },
};
