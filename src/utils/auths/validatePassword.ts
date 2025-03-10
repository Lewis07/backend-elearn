import * as bcrypt from 'bcrypt';

export async function validatePassword(
  plain_password: string,
  hash_password: string,
): Promise<boolean> {
  return await bcrypt.compare(plain_password, hash_password);
}
