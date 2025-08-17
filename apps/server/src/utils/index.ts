// Gen Random Username
export const genUsername = (): string => {
  const userPrefix = 'User-';
  const userSuffix = Math.random().toString(36).slice(2);

  const userName = userPrefix + userSuffix;

  return userName;
};
