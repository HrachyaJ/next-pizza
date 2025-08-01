import NextAuth from "next-auth";
import { authOptions } from "@/constants/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
