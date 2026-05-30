// server.ts
import express, { type Request, type Response } from "express";
import cors from "cors";
import { getDeck, drawCards } from "./api";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get(
  "/api/deck",
  async (req: Request<{}, {}, {}, { query?: string }>, res: Response) => {
    try {
      const deck = await getDeck({ query: req.query.query });
      res.json(deck);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate deck" });
    }
  },
);

app.post("/api/draw", async (req: Request, res: Response) => {
  try {
    const drawResult = await drawCards({
      cards: Array.isArray(req.body?.cards) ? req.body.cards : [],
    });
    res.json(drawResult);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Failed to draw cards" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
