import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL?.trim();

export const hasDatabaseConfig = Boolean(connectionString);

function createFallbackPrismaClient() {
  const modelProxy = new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property === "symbol") {
          return undefined;
        }

        return new Proxy(function () {}, {
          get(_methodTarget, method) {
            if (typeof method === "symbol") {
              return undefined;
            }

            const methodName = String(method);

            if (
              ["findMany", "findFirst", "findRaw", "queryRaw"].includes(
                methodName,
              )
            ) {
              return async () => [];
            }

            if (["findUnique", "findUniqueOrThrow"].includes(methodName)) {
              return async () => null;
            }

            if (["count", "aggregate", "groupBy"].includes(methodName)) {
              return async () => 0;
            }

            if (["create", "update", "upsert", "delete"].includes(methodName)) {
              return async () => null;
            }

            if (
              ["createMany", "updateMany", "deleteMany"].includes(methodName)
            ) {
              return async () => ({ count: 0 });
            }

            return async () => null;
          },
          apply() {
            return Promise.resolve(null);
          },
        });
      },
    },
  );

  return modelProxy as any;
}

export const prisma = hasDatabaseConfig
  ? new PrismaClient({
      adapter: new PrismaPg({ connectionString: connectionString! }),
    })
  : createFallbackPrismaClient();

export { prisma as defaultPrisma };
