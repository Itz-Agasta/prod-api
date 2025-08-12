import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import type { Iuser } from '@/models/user';
import User from '@/models/user';
import { genUsername } from '@/utils';

type UserData = Pick<Iuser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    logger.error('Error during registration', err);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export default register;
