import { Router, Request, Response } from "express";
import { getAlerts, getSummary, getLandscapes } from "../services/dataLoader";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { landscape, status, severity } = req.query as Record<string, string>;
  const alerts = getAlerts({ landscape, status, severity });
  res.json(alerts);
});

router.get("/summary", (req: Request, res: Response) => {
  const { landscape } = req.query as Record<string, string>;
  const summary = getSummary(landscape);
  res.json(summary);
});

export { router as alertsRouter };
