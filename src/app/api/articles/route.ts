import { NextRequest, NextResponse } from "next/server";
import { Article } from "@prisma/client";
import { CreateArticleDto } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchema";
import prisma from '@/utils/db'
import {articlePerPage} from "@/utils/constants"
import {verifyToken} from '@/utils/verifyTokken'


// @method GET
// @route /api/articles
// @desc Get All Articles
// @access public
export async function GET(request: NextRequest) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    
    const articles = await prisma.article.findMany({
      skip: articlePerPage * (parseInt(pageNumber) - 1),
      take:articlePerPage
    });
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

// @method POST
// @route /api/articles
// @desc Crete New Article
// @access private (only admin)
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if(user === null || user.isAdmin === false){
      return NextResponse.json({message: "only admin can create new artcile"} , {status:403})
    }
    const body = (await request.json()) as CreateArticleDto;

    //   validation input data
    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    //   Create and save article in DB
    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
