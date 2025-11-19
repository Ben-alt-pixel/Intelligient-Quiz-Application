import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/config/database";
import { env } from "@/config/env";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "LECTURER"]),
  regNo: z.string().optional(),
});

const LoginSchema = z.object({
  emailOrRegNo: z.string(),
  password: z.string(),
});

export class AuthService {
  static async register(data: z.infer<typeof RegisterSchema>) {
    RegisterSchema.parse(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, data.regNo ? { regNo: data.regNo } : {}],
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        regNo: data.role === "STUDENT" ? data.regNo : undefined,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        regNo: user.regNo,
      },
      token,
    };
  }

  static async login(data: z.infer<typeof LoginSchema>) {
    LoginSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.emailOrRegNo }, { regNo: data.emailOrRegNo }],
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    console.log(user);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        regNo: user.regNo,
      },
      token,
    };
  }
}
