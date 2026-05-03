import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListCompaniesQueryParams,
  CreateCompanyBody,
  GetCompanyParams,
  UpdateCompanyBody,
  DeleteCompanyParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/companies", async (req, res) => {
  const query = ListCompaniesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  let companies = await db.select().from(companiesTable);

  if (query.data.tier) {
    const tier = Number(query.data.tier);
    companies = companies.filter((c) => c.tier === tier);
  }
  if (query.data.geography) {
    companies = companies.filter((c) => c.geography === query.data.geography);
  }

  res.json(companies);
});

router.post("/companies", async (req, res) => {
  const body = CreateCompanyBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [company] = await db
    .insert(companiesTable)
    .values({
      ...body.data,
      tier: body.data.tier ?? 1,
      geography: body.data.geography ?? "GLOBAL",
    })
    .returning();

  res.status(201).json(company);
});

router.get("/companies/:id", async (req, res) => {
  const rawId = req.params.id;
  const numId = Number(rawId);

  let company;
  if (!isNaN(numId) && Number.isInteger(numId) && numId > 0) {
    const params = GetCompanyParams.safeParse({ id: numId });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, params.data.id));
  } else {
    [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.name, rawId));
  }

  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  res.json(company);
});

router.put("/companies/:id", async (req, res) => {
  const params = { id: Number(req.params.id) };
  const body = UpdateCompanyBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [company] = await db
    .update(companiesTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(companiesTable.id, params.id))
    .returning();

  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  res.json(company);
});

router.delete("/companies/:id", async (req, res) => {
  const params = DeleteCompanyParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(companiesTable).where(eq(companiesTable.id, params.data.id));
  res.status(204).send();
});

export default router;
