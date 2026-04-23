import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { benchmarksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListBenchmarksQueryParams,
  CreateBenchmarkBody,
  UpdateBenchmarkBody,
  DeleteBenchmarkParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/benchmarks", async (req, res) => {
  const query = ListBenchmarksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  let benchmarks = await db.select().from(benchmarksTable);

  if (query.data.functionTag) {
    benchmarks = benchmarks.filter((b) => b.functionTag === query.data.functionTag);
  }

  res.json(benchmarks);
});

router.post("/benchmarks", async (req, res) => {
  const body = CreateBenchmarkBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [benchmark] = await db.insert(benchmarksTable).values(body.data).returning();
  res.status(201).json(benchmark);
});

router.put("/benchmarks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateBenchmarkBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [benchmark] = await db
    .update(benchmarksTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(benchmarksTable.id, id))
    .returning();

  if (!benchmark) {
    res.status(404).json({ error: "Benchmark not found" });
    return;
  }

  res.json(benchmark);
});

router.delete("/benchmarks/:id", async (req, res) => {
  const params = DeleteBenchmarkParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(benchmarksTable).where(eq(benchmarksTable.id, params.data.id));
  res.status(204).send();
});

export default router;
