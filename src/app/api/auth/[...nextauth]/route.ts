// import { db } from "@/db";
// import { accounts, authorizedUsers, sessions, users, verificationTokens } from "@/db/schema";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { eq } from "drizzle-orm";
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//     accountsTable: accounts,
//     sessionsTable: sessions,
//     verificationTokensTable: verificationTokens,
//   }),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       if (!user.email) {
//         return false;
//       }

//       const existing = await db
//         .select()
//         .from(authorizedUsers)
//         .where(eq(authorizedUsers.email, user.email))
//         .execute();

//       if (existing.length === 0) {
//         return false;
//       }

//       return true;
//     },
//   },
// });

// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// import { handlers } from "@/lib/auth";

// export { handlers as GET, handlers as POST };
export { GET, POST } from "@/lib/auth";
