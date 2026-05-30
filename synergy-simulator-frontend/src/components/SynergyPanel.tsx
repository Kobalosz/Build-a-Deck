import React from "react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const TAG_INFO: Record<
  string,
  { title: string; description: string; tone: "good" | "warn" | "info" }
> = {
  lifegain_payoff: {
    title: "Lifegain payoff",
    description: "Triggers/rewards for gaining life.",
    tone: "good",
  },
};

export function SynergyPanel({ tags }: { tags: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Synergy scan</CardTitle>
        <CardDescription>A quick read of your drawn hand.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!tags.length ? (
          <div className="text-sm text-muted-foreground">
            No tags yet. Draw a hand to see highlighted themes.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const info = TAG_INFO[t];
              const title = info?.title ?? t;

              const variant =
                info?.tone === "warn"
                  ? "destructive"
                  : info?.tone === "good"
                    ? "default"
                    : "secondary";

              return (
                <Badge key={t} variant={variant} title={info?.description}>
                  {title}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Tip: try{" "}
          <code className="text-foreground">type:creature color:g</code>
        </div>
      </CardContent>
    </Card>
  );
}
