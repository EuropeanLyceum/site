import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

function getIdFromRequest(req: NextRequest): number | null {
  const idStr = req.nextUrl.pathname.split("/").pop();
  const id = idStr ? Number(idStr) : NaN;
  return isNaN(id) ? null : id;
}

// DELETE - видалення посилання
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ message: "Посилання видалено" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// PATCH - редагування посилання
export async function PATCH(request: NextRequest) {
  const id = getIdFromRequest(request);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await prisma.link.update({
      where: { id },
      data: {
        title: body.title,
        url: body.url,
        content: body.content,
        year: body.year,
        subject: body.subject,
        category: body.category,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PATCH error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
