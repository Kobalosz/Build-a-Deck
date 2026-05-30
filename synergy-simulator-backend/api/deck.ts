import { getDeck } from "../api";
import { handleOptions, setCors } from "./_utils";

export default async function handler(req: any, res: any) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    const query =
      typeof req.query?.query === "string" ? req.query.query : undefined;
    const deck = await getDeck({ query });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify(deck));
  } catch (error: unknown) {
    console.error(error);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Failed to generate deck" }));
  }
}
