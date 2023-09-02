import { format, formatDistance } from "date-fns";

export const formatDate = (timestamp, formatType) => {
  const date = new Date(timestamp * 1000);
  switch (formatType) {
    case "t":
      return format(date, "h:mm a");
    case "T":
      return format(date, "h:mm:ss a");
    case "d":
      return format(date, "MM/dd/yyyy");
    case "D":
      return format(date, "MMMM d, yyyy");
    case "f":
      return format(date, "MMMM d, yyyy h:mm a");
    case "F":
      return format(date, "EEEE, MMMM d, yyyy h:mm a");
    case "R":
      return formatDistance(date, new Date(), { addSuffix: true });
    default:
      return "Invalid format type";
  }
};
