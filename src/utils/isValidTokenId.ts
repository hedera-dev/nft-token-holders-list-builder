export const isValidTokenId = (tokenId: string): boolean => {
  const regex = /^0\.0\.\d*$/;
  return regex.test(tokenId);
};
