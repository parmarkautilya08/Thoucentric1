import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { signalsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListSignalsQueryParams,
  CreateSignalBody,
  DeleteSignalParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/signals", async (req, res) => {
  const query = ListSignalsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  let signals = await db.select().from(signalsTable).orderBy(signalsTable.createdAt);

  if (query.data.companyId) {
    signals = signals.filter((s) => s.companyId === query.data.companyId);
  }
  if (query.data.strength) {
    signals = signals.filter((s) => s.strength === query.data.strength);
  }
  if (query.data.category) {
    signals = signals.filter((s) => s.category === query.data.category);
  }

  res.json(signals.reverse());
});

router.post("/signals", async (req, res) => {
  const body = CreateSignalBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [signal] = await db.insert(signalsTable).values(body.data).returning();
  res.status(201).json(signal);
});

router.delete("/signals/:id", async (req, res) => {
  const params = DeleteSignalParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(signalsTable).where(eq(signalsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
