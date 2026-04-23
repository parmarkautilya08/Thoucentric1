import { Router, type IRouter } from "express";
import healthRouter from "./health";
import companiesRouter from "./companies";
import sheiCardsRouter from "./shei_cards";
import signalsRouter from "./signals";
import benchmarksRouter from "./benchmarks";
import playbooksRouter from "./playbooks";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(companiesRouter);
router.use(sheiCardsRouter);
router.use(signalsRouter);
router.use(benchmarksRouter);
router.use(playbooksRouter);
router.use(dashboardRouter);
router.use(adminRouter);

export default router;
