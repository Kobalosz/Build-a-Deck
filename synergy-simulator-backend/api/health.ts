import { handleOptions, setCors } from "./_utils";

export default async function handler(req: any, res: any) {
  setCors(res);
  if (handleOptions(req, res)) return;

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
}
