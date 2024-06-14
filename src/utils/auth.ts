import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

export const createAccessToken = (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword);
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
};
