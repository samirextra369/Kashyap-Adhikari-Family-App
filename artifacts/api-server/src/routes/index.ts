import { Router, type IRouter } from "express";
import healthRouter from "./health";
import genealogyRouter from "./genealogy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(genealogyRouter);

export default router;
