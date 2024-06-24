export const toLocaleDate = function (date: Date, type: 'en-CA' | 'en-US' | 'en-GB'): string {
  return date.toLocaleDateString(type);
};

export const formatDate = function (date: Date): string {
  const formattedDate = date.toISOString().split('T')[0];

  return formattedDate;
};

export const today = function (): Date {
  return new Date(formatDate(new Date()));
};
