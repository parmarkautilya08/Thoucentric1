import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { sheiCardsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListSheiCardsQueryParams,
  CreateSheiCardBody,
  GetSheiCardParams,
  UpdateSheiCardBody,
  DeleteSheiCardParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/shei-cards", async (req, res) => {
  const query = ListSheiCardsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  let cards = await db.select().from(sheiCardsTable);

  if (query.data.functionTag) {
    cards = cards.filter((c) => c.functionTag === query.data.functionTag);
  }
  if (query.data.geography) {
    cards = cards.filter((c) => c.geographyTag === query.data.geography);
  }
  if (query.data.urgency) {
    cards = cards.filter((c) => c.urgency === query.data.urgency);
  }

  res.json(cards);
});

router.post("/shei-cards", async (req, res) => {
  const body = CreateSheiCardBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [card] = await db.insert(sheiCardsTable).values(body.data).returning();
  res.status(201).json(card);
});

router.get("/shei-cards/:id", async (req, res) => {
  const params = GetSheiCardParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [card] = await db
    .select()
    .from(sheiCardsTable)
    .where(eq(sheiCardsTable.id, params.data.id));

  if (!card) {
    res.status(404).json({ error: "SHEI card not found" });
    return;
  }

  res.json(card);
});

router.put("/shei-cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateSheiCardBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [card] = await db
    .update(sheiCardsTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(sheiCardsTable.id, id))
    .returning();

  if (!card) {
    res.status(404).json({ error: "SHEI card not found" });
    return;
  }

  res.json(card);
});

router.delete("/shei-cards/:id", async (req, res) => {
  const params = DeleteSheiCardParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(sheiCardsTable).where(eq(sheiCardsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
