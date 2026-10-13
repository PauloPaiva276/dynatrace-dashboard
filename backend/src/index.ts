import express from "express";
import cors from "cors";
import { alertsRouter } from "./routes/alerts";
import { getLandscapes } from "./services/dataLoader";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/api/landscapes", (_req, res) => {
  res.json(getLandscapes());
});

app.use("/api/alerts", alertsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
