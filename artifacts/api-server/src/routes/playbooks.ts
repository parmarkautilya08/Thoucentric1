import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { playbookSectionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListPlaybooksQueryParams,
  CreatePlaybookSectionBody,
  UpdatePlaybookSectionBody,
  DeletePlaybookSectionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/playbooks", async (req, res) => {
  const query = ListPlaybooksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  let sections = await db.select().from(playbookSectionsTable);

  if (query.data.function) {
    sections = sections.filter((s) => s.functionTag === query.data.function);
  }

  res.json(sections.sort((a, b) => a.sectionNumber - b.sectionNumber));
});

router.post("/playbooks", async (req, res) => {
  const body = CreatePlaybookSectionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [section] = await db.insert(playbookSectionsTable).values(body.data).returning();
  res.status(201).json(section);
});

router.put("/playbooks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdatePlaybookSectionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [section] = await db
    .update(playbookSectionsTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(playbookSectionsTable.id, id))
    .returning();

  if (!section) {
    res.status(404).json({ error: "Playbook section not found" });
    return;
  }

  res.json(section);
});

router.delete("/playbooks/:id", async (req, res) => {
  const params = DeletePlaybookSectionParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db
    .delete(playbookSectionsTable)
    .where(eq(playbookSectionsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
