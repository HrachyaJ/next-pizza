import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();
  
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  prisma.user

  const user = await prisma.user.create({
    data
  });

  return NextResponse.json(user);
}