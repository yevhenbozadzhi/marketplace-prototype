import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://n5deal:n5deal@postgres:5432/n5deal_marketplace?schema=public",
  },
});