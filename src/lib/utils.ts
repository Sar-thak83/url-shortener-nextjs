import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateShortCode = (): string => {
  return nanoid(8);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
