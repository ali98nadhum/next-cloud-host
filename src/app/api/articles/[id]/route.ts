import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { UpdateArticleDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyTokken";

interface Props {
  params: { id: string };
}

// @method GET
// @route /api/articles/:id
// @desc Get Article by id
// @access public
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            cretedAt: "desc",
          },
        },
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}

// @method PUT
// @route /api/articles/:id
// @desc update article
// @access private (only admin)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin can create new artcile" },
        { status: 403 }
      );
    }
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateArticleDto;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}

// @method DELETE
// @route /api/articles/:id
// @desc Delete Article
// @access private (only admin)
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin can create new artcile" },
        { status: 403 }
      );
    }
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
      include: {comments:true}
    });

    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    // delete article
    await prisma.article.delete({ where: { id: parseInt(params.id) } });

    // delete comment for article
    const commentIds: number[] = article?.comments.map(comment => comment.id);
    await prisma.comment.deleteMany({
      where: {id:{in:commentIds}}
    })

    return NextResponse.json({ message: "Article deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}
