const DEFAULT_API_BASE = "https://build-a-deck-orpin.vercel.app";

export const API_BASE = (
  process.env.REACT_APP_API_BASE || DEFAULT_API_BASE
).replace(/\/$/, "");
