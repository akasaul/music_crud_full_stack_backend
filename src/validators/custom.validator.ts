import { CustomHelpers } from "joi";

export const objectId = (value: string, helpers: CustomHelpers): string => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("invalid mongo id");
  }
  return value;
};
