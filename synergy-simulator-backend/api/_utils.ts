export function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function handleOptions(req: any, res: any): boolean {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export async function readJsonBody(req: any): Promise<any> {
  // Vercel may already parse JSON in some runtimes, but we can't assume.
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve());
    req.on("error", reject);
  });

  if (!chunks.length) {
    return undefined;
  }

  const text = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(text);
}
