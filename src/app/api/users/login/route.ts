import { NextResponse, NextRequest } from "next/server";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchema";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { JwtPayload } from "@/utils/types";
import {setCookie} from "@/utils/generateToken";



// @method POST
// @route /api/users/login
// @desc Login user
// @access public
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDto;
    // validation input data
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // validation if email true or not
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "invaild email or password" },
        { status: 400 }
      );
    }

    // validation if password true or not
    const isPasswordMarch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMarch) {
      return NextResponse.json(
        { message: "invaild email or password" },
        { status: 400 }
      );
    }

    // Make token
    const jwtPayload:JwtPayload = {
      id: user.id,
      isAdmin: user.isAdmin,
      username: user.username,
    };

    const cookie = setCookie(jwtPayload)

    return NextResponse.json({ message: "Logined" }, { status: 200, headers: {"Set-Cookie": cookie} });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}
