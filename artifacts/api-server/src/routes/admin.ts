import { Router } from "express";
import { seedDatabase } from "./seed";

const router = Router();

router.post("/admin/reseed", async (_req, res) => {
  try {
    await seedDatabase(true);
    res.json({ success: true, message: "Database re-seeded successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
});

export default router;
