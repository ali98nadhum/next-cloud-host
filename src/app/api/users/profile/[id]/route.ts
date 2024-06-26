import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyTokken";
import { UpdateUserDto } from "@/utils/dtos";
import bcrypt from "bcryptjs";

interface Props {
  params: { id: string };
}

// @method DELETE
// @route /api/users/profile/:id
// @desc Delete user profile
// @access Private (only user himself)
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {comments:true}
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userToken = verifyToken(request);

    if (userToken !== null && userToken.id === user.id) {
      // delete user profile
      await prisma.user.delete({ where: { id: parseInt(params.id) } });
      // delete comment for user
      const commentIds = user?.comments.map(comment => comment.id)
      await prisma.comment.deleteMany({
        where: {
          id: {in:commentIds}
        }
      })
      return NextResponse.json(
        { message: "your profile has been deleted" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Only user himself can delete his profile" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}

// @method GET
// @route /api/users/profile/:id
// @desc Get user profile by id
// @access Private (only user himself)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        email: true,
        username: true,
        cretedAt: true,
        isAdmin: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}

// @method PUT
// @route /api/users/profile/:id
// @desc Update user profle
// @access Private (only user himself)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // Get user from Db by id
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // chack user token
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 }
      );
    }

    // get input from body
    const body = (await request.json()) as UpdateUserDto;
    // hash new password if found
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    // update user and save in db
    const updateUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
      select: {
        id: true,
        email: true,
        username: true,
        cretedAt: true,
        isAdmin: true,
      },
    });

    return NextResponse.json(updateUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}
