import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.PREVIEW_URL || "http://127.0.0.1:3000", channel: "msedge", headless: true },
  reporter: "list",
});
