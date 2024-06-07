import { hash, compare } from 'bcrypt';

export const createPasswordHashed = async (
  password: string,
  saltOrRounds: number = 10,
): Promise<string> => {
  return hash(password, saltOrRounds);
};

export const validatePassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return compare(password, passwordHashed);
};
