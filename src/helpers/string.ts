export const capitalize = (text: string): string => {
  if (text === '') {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.substr(1);
};
