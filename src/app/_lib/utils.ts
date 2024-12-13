/* eslint-disable prefer-const */

/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for converting an array of Tailwind CSS classes into
 * a single `className` string with no style conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  // clsx takes in input and converts truthy values into a single string:
  //
  //      clsx(['foo', 0, false, 'bar']) becomes 'foo bar';
  //
  // twMerge merges Tailwind CSS classes while fixing style conflicts:
  //
  //      twMerge('px-2 py-1', 'p-3') becomes 'p-3'
  //
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`unexpected error: ${JSON.stringify(error)}`);
  }
};

// PLACEHOLDER LOADER - while image is transforming
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${
  toBase64(
    shimmer(1000, 1000),
  )
}`;
// ==== End

// DOWNLOAD IMAGE
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length) {
        a.download = `${filename.replace(" ", "_")}.png`;
      }
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

// DEEP MERGE OBJECTS
export const deepMergeObjects = (obj1: any, obj2: any) => {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};

// CONVERT STRING TO NUMBER
export const convertStringToNumber = (value: any) => {
  if (typeof value === "string") {
    var num: number = +value;
    return num;
  }
};

// CONVERT STRING TO DATE
export const convertStringToDate = (value: any) => {
  if (typeof value === "string") {
    var date = new Date(value);
    return date;
  }
};
