import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Отримати всі посилання
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error("❌ GET /links error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// Створити нове посилання
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, content, year, subject, category } = body;

    if (!title || !category) {
      return NextResponse.json(
        { message: "Обов'язкові поля: title та category" },
        { status: 400 }
      );
    }

    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        content,
        year,
        subject,
        category,
      },
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("❌ POST /links error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
