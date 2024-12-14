const now = new Date();
const DAY_IN_MILLISECOND = 7 * 24 * 60 * 60 * 1000;

export const TOKEN_AUTH_EXPIRED_AT = new Date(
  now.getTime() + DAY_IN_MILLISECOND,
);
