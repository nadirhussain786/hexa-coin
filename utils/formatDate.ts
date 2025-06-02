export const formatDateTime = (input: string | number | Date): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    month: "short", // "Jun"
    day: "numeric", // "1"
    year: "numeric", // "2025"
    hour: "2-digit", // "14"
    minute: "2-digit", // "32"
    hour12: false,   // 24-hour format
  }).replace(",", " •");
};
