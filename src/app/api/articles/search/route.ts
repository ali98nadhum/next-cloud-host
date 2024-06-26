import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// @method GET
// @route /api/articles/search?searchText=value
// @desc Get artcile by search
// @access public
export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");
    let artciles;
    if (searchText) {
      artciles = await prisma.article.findMany({
        where: {
          title: {
            startsWith: searchText,
            mode: "insensitive"
          }
        },
      });
    } else {
      artciles = await prisma.article.findMany({ take: 6 });
    }

    return NextResponse.json(artciles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
