//import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return NextResponse.json(articles);
}
