import { useState } from "react";
import { apiClient } from "../../lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface CacheResult {
  strategy: string;
  description: string;
  timestamp?: string;
  random?: number;
  fetchedAt: string;
  cacheControlHeader: string | null;
  etagHeader: string | null;
  responseStatus: number;
  note?: string;
  version?: string;
}

const STRATEGIES = [
  {
    key: "max-age",
    endpoint: "/cache-test/max-age",
    label: "max-age=3600",
    badge: "bg-green-100 text-green-800",
    hint: "Browser caches this for 1 hour — the timestamp & random value will stay the same on repeated clicks (until the browser cache expires).",
  },
  {
    key: "no-cache",
    endpoint: "/cache-test/no-cache",
    label: "no-cache",
    badge: "bg-yellow-100 text-yellow-800",
    hint: "Browser must revalidate with the server every time — the timestamp & random value change on each request.",
  },
  {
    key: "no-store",
    endpoint: "/cache-test/no-store",
    label: "no-store",
    badge: "bg-red-100 text-red-800",
    hint: "Browser never stores the response — the timestamp & random value always come fresh from the server.",
  },
  {
    key: "etag",
    endpoint: "/cache-test/etag",
    label: "etag",
    badge: "bg-blue-100 text-blue-800",
    hint: "Browser can revalidate with If-None-Match. In DevTools you should see ETag and potentially 304 Not Modified on repeat requests.",
  },
] as const;

export function CacheDemo() {
  const [results, setResults] = useState<Record<string, CacheResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function fetchStrategy(key: string, endpoint: string) {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const response =
        await apiClient.get<
          Omit<
            CacheResult,
            "fetchedAt" | "cacheControlHeader" | "etagHeader" | "responseStatus"
          >
        >(endpoint);
      const cacheControl = response.headers["cache-control"];
      const etag = response.headers.etag;
      setResults((prev) => ({
        ...prev,
        [key]: {
          ...response.data,
          fetchedAt: new Date().toISOString(),
          cacheControlHeader:
            typeof cacheControl === "string" ? cacheControl : null,
          etagHeader: typeof etag === "string" ? etag : null,
          responseStatus: response.status,
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Cache-Control Demo
        </h1>
        <p className="text-muted-foreground">
          Click each button to fetch from an endpoint with a different{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            Cache-Control
          </code>{" "}
          header or validation behavior. Watch the <strong>timestamp</strong>,{" "}
          <strong>random</strong>, and response headers — or open DevTools →
          Network to inspect the actual cache flow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STRATEGIES.map(({ key, endpoint, label, badge, hint }) => {
          const result = results[key];
          const isLoading = loading[key];

          return (
            <Card key={key} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}
                  >
                    {label}
                  </span>
                </div>
                <CardTitle className="text-base mt-1">
                  Cache-Control: {label}
                </CardTitle>
                <CardDescription className="text-xs">{hint}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 flex-1">
                <button
                  onClick={() => fetchStrategy(key, endpoint)}
                  disabled={isLoading}
                  className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? "Fetching…" : "Fetch"}
                </button>

                {result && (
                  <div className="rounded-md border bg-muted/40 p-3 text-xs space-y-1.5 font-mono">
                    <div>
                      <span className="text-muted-foreground">
                        server timestamp:{" "}
                      </span>
                      <span className="font-semibold">
                        {result.timestamp ?? "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">random: </span>
                      <span className="font-semibold">
                        {typeof result.random === "number"
                          ? result.random.toFixed(6)
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        fetched at:{" "}
                      </span>
                      <span>{result.fetchedAt}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Cache-Control header:{" "}
                      </span>
                      <span className="font-semibold text-primary">
                        {result.cacheControlHeader ?? "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        ETag header:{" "}
                      </span>
                      <span className="font-semibold text-primary">
                        {result.etagHeader ?? "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">status: </span>
                      <span>{result.responseStatus}</span>
                    </div>
                    {result.version && (
                      <div>
                        <span className="text-muted-foreground">version: </span>
                        <span>{result.version}</span>
                      </div>
                    )}
                    {result.note && (
                      <div className="text-muted-foreground">{result.note}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: open <strong>DevTools → Network</strong>, disable cache, and
        compare the <em>Size</em> column — cached responses show "(disk cache)"
        or "(memory cache)" instead of actual bytes. For the ETag example, keep
        cache enabled and look for <strong>If-None-Match</strong> on the request
        and <strong>304 Not Modified</strong> on repeat fetches.
      </p>
    </div>
  );
}
