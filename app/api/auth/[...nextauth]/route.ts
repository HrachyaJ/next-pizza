import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/constants/auth-options";

const handler = NextAuth(authOptions);

export async function GET(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  return handler(request, context);
}
