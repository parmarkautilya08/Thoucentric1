import express, { type Express } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { seedDatabase } from "./routes/seed";

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = [
  path.resolve(process.cwd(), "../research-pod/dist/public"),
  path.resolve(process.cwd(), "artifacts/research-pod/dist/public"),
  path.resolve(__dirname, "../../research-pod/dist/public"),
].find((candidate) => existsSync(path.join(candidate, "index.html")));

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  logger.warn("Frontend build output was not found; serving API routes only");
}

seedDatabase().catch((err) => {
  logger.error({ err }, "Failed to seed database");
});

export default app;
