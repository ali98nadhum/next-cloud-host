import { NextResponse, NextRequest } from "next/server";
import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchema";
import { JwtPayload } from "@/utils/types";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import {setCookie} from "@/utils/generateToken";

// @method POST
// @route /api/users/register
// @desc Register New User
// @access public
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDto;

    // validation input data
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // if user exits
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      return NextResponse.json(
        { message: "User already register" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    // Create new user and save in DB
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashPassword,
      },

      select: {
        username: true,
        id: true,
        isAdmin: true,
        cretedAt:true
      },
    });

    // Make token
    const jwtPayload: JwtPayload = {
      id: newUser.id,
      isAdmin: newUser.isAdmin,
      username: newUser.username,
    };

    const cookie = setCookie(jwtPayload)

    return NextResponse.json(newUser, { status: 201, headers: {"Set-Cookie": cookie} });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );
  }
}
