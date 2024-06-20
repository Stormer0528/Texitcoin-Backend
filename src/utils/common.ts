export const toLocaleDate = function (date: Date, type: 'en-CA' | 'en-US' | 'en-GB'): string {
  return date.toLocaleDateString(type);
};
