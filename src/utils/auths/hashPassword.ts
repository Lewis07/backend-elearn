import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  return hash;
}
