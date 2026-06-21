import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    return `${baseUrl}${path}`;
};

export const truncateWords = (text, wordLimit = 10) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

export const groupPermissions = (data) => Object.values(
    data?.reduce((acc, curr) => {
      const [resource, action] = curr.name.split(":");
      if (!acc[resource]) {
        acc[resource] = {
          resource,
          permissions: {},
        };
      }
      acc[resource].permissions[action] = curr;
      return acc;
    }, {})
  );
