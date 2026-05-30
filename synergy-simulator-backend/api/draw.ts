import { drawCards } from "../api";
import { handleOptions, readJsonBody, setCors } from "./_utils";

export default async function handler(req: any, res: any) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    const body = await readJsonBody(req);
    const cards = Array.isArray(body?.cards) ? body.cards : [];

    const result = await drawCards({ cards });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (error: unknown) {
    console.error(error);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Failed to draw cards" }));
  }
}
