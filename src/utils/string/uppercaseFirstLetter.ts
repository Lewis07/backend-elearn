export const uppercaseFirstLetter = (letter: string): string => {
  return `${letter.charAt(0).toLocaleUpperCase()}${letter.slice(1).toLocaleLowerCase()}`;
};
