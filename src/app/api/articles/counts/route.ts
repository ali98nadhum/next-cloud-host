import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// @method GET
// @route /api/articles/counts
// @desc Get artciles count
// @access public
export async function GET(request: NextRequest) {
  try {
    const countArticle = await prisma.article.count();
    return NextResponse.json({countArticle}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
