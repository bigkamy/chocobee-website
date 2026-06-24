import { withAuth } from "next-auth/middleware";

// Protect the whole admin dashboard. Unauthenticated visitors are redirected to
// the custom sign-in page. The login page itself is excluded via the matcher so
// it stays reachable. (Next.js renamed the `middleware` convention to `proxy`.)
export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin", "/admin/((?!login|forgot-password|reset-password).*)"],
};
