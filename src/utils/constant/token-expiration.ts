const now = new Date();
export const TOKEN_AUTH_EXPIRED_AT = new Date(
  now.getTime() + 7 * 24 * 60 * 60 * 1000,
);
