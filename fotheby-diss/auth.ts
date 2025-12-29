import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "./lib/prisma";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // ✅ FIX: Credentials REQUIRE JWT strategy
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Staff Login",
      credentials: {
        staffId: { label: "Staff ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { staffId: credentials.staffId },
        });

        if (!user || (user.role !== "STAFF" && user.role !== "MANAGER")) {
          return null;
        }

        if (!user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!valid) return null;

        console.log("AUTHORIZE USER:", {
          id: user.id,
          name: user.name,
          role: user.role,
          staffId: user.staffId,
        });

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          staffId: user.staffId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.staffId = (user as any).staffId;
      }
      return token;
    },

    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).staffId = token.staffId;
      return session;
    },
  },
});
