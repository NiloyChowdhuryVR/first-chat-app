// import { authOptions } from "@/lib/auth";
// import NextAuth from "next-auth/next";

// export default NextAuth(authOptions)

import { authOptions } from "@/lib/auth";
import  NextAuth  from "next-auth";

export const handler = NextAuth(authOptions) as never;

export { handler as GET, handler as POST };
