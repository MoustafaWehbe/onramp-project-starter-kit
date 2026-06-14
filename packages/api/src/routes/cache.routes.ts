import { Router, type Request, type Response } from "express";

export const cacheRouter = Router();

// Returns a timestamp. Cached by the browser for 1 hour.
cacheRouter.get("/max-age", (_req: Request, res: Response) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json({
    strategy: "max-age=3600",
    description:
      "Browser may serve this from cache for up to 1 hour without contacting the server.",
    timestamp: new Date().toISOString(),
    random: Math.random(),
  });
});

// Returns a timestamp. Browser must revalidate with the server on every request.
cacheRouter.get("/no-cache", (_req: Request, res: Response) => {
  res.set("Cache-Control", "no-cache");
  res.json({
    strategy: "no-cache",
    description:
      "Browser must revalidate with the server before serving from cache.",
    timestamp: new Date().toISOString(),
    random: Math.random(),
  });
});

// Returns a timestamp. Browser must never cache this response.
cacheRouter.get("/no-store", (_req: Request, res: Response) => {
  res.set("Cache-Control", "no-store");
  res.json({
    strategy: "no-store",
    description:
      "Browser must not store this response at all — always fetched fresh.",
    timestamp: new Date().toISOString(),
    random: Math.random(),
  });
});

// Returns stable content so the browser can revalidate it using ETag.
cacheRouter.get("/etag", (req: Request, res: Response) => {
  const etagPayload = {
    strategy: "etag",
    description:
      "Browser revalidates using If-None-Match and the server may reply with 304 Not Modified.",
    version: "demo-v1",
    note: "This response body is stable so the ETag stays the same across requests until the version changes.",
  };
  const etagValue = `W/"${Buffer.from(JSON.stringify(etagPayload)).toString("base64")}"`;

  res.set("ETag", etagValue);
  res.set("Cache-Control", "no-cache");

  if (req.headers["if-none-match"] === etagValue) {
    res.status(304).end();
    return;
  }

  res.json(etagPayload);
});
