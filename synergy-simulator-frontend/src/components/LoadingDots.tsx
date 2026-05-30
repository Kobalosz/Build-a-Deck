import React from "react";

export function LoadingDots({ label }: { label: string }) {
  return (
    <span aria-label={label} title={label} style={{ display: "inline-flex" }}>
      <span className="LoadingDots">
        <span className="LoadingDot" />
        <span className="LoadingDot" />
        <span className="LoadingDot" />
      </span>
    </span>
  );
}
