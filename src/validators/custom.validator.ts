import  { CustomHelpers } from "joi";

// Type definition for the custom ObjectId validator function
export const objectId = (value: string, helpers: CustomHelpers): string => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error('invalid mongo id')
  }
  return value;
};
