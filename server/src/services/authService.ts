import bcrypt from 'bcrypt';
import prisma from '../config/db';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerUser = async (data: any) => {
  const { email, password, username } = registerSchema.parse(data);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

export const loginUser = async (data: any) => {
  const { email, password } = loginSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

export const upsertGoogleUser = async (profile: { email: string, name: string, picture?: string, sub: string }) => {
  let user = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        username: profile.email.split('@')[0] + Math.random().toString(36).substring(7),
        avatarUrl: profile.picture,
        oauthProvider: 'google',
        oauthId: profile.sub,
      },
    });
  } else if (!user.oauthProvider) {
    // If user existed via email/password, link the google account
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        oauthProvider: 'google',
        oauthId: profile.sub,
        avatarUrl: user.avatarUrl || profile.picture,
      },
    });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};
