import { defineFunction } from "@aws-amplify/backend";

export const honoApi = defineFunction({
  name: "hono-api",
  entry: "./handler.ts",
});
