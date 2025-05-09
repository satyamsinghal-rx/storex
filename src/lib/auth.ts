// import { getServerSession, type NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { db } from "@/db";
// import { accounts, authorizedUsers, sessions, users, verificationTokens } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export const authOptions: NextAuthOptions = {
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//     accountsTable: accounts,
//     sessionsTable: sessions,
//     verificationTokensTable: verificationTokens,
//   }),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       if (!user.email) return false;

//       const existing = await db
//         .select()
//         .from(authorizedUsers)
//         .where(eq(authorizedUsers.email, user.email))
//         .execute();

//       return existing.length > 0;
//     },
//   },
// };

// export const auth = async () => await getServerSession(authOptions);

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@/lib/drizzle-adapter";
import { db } from "@/db";
import { authorizedUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await db
        .select()
        .from(authorizedUsers)
        .where(eq(authorizedUsers.email, user.email))
        .execute();

      return existing.length > 0;
    },
  },
});
