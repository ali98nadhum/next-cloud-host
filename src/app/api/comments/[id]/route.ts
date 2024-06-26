import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyTokken";
import { UpdateCommentDto } from "@/utils/dtos";

interface Props {
  params: { id: string };
}

// @method PUT
// @route /api/comments/:id
// @desc Update Comment
// @access Private (only user of the comment)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 }
      );
    }
    const user = verifyToken(request);
    if (user === null || user.id !== comment.userId) {
      return NextResponse.json(
        { message: "you are not allowed this comment" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as UpdateCommentDto;
    const updateComment = await prisma.comment.update({
      where: { id: parseInt(params.id) },
      data: { text: body.text },
    });

    return NextResponse.json(updateComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}

// @method DELETE
// @route /api/comments/:id
// @desc Delete comment
// @access Private (only admin or user of the comment)
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 }
      );
    }

    const user = verifyToken(request);
    if (user === null) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    if (user.isAdmin || user.id === comment.userId) {
      await prisma.comment.delete({ where: { id: parseInt(params.id) } });
      return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "You are not allowed" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}
