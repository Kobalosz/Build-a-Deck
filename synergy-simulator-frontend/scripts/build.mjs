import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const isWin = process.platform === "win32";
const bin = (name) =>
  path.resolve(
    projectRoot,
    "node_modules",
    ".bin",
    isWin ? `${name}.cmd` : name,
  );

const ensureBin = (name) => {
  const p = bin(name);
  if (!fs.existsSync(p)) {
    throw new Error(
      `Missing ${name} binary at ${p}. If you are on Tailwind v4, install @tailwindcss/cli.`,
    );
  }
  return p;
};

const tailwindIn = path.resolve(projectRoot, "src", "styles", "tailwind.css");
const tailwindOut = path.resolve(projectRoot, "src", "styles", "generated.css");

function run(name, args, extraEnv) {
  return new Promise((resolve) => {
    const cmd = ensureBin(name);
    const p = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: "inherit",
      env: { ...process.env, ...extraEnv },
    });
    p.on("error", (e) => {
      console.error(e);
      resolve(1);
    });
    p.on("exit", (code) => resolve(code ?? 1));
  });
}

const twCode = await run("tailwindcss", [
  "-c",
  "tailwind.config.mjs",
  "-i",
  tailwindIn,
  "-o",
  tailwindOut,
]);
if (twCode !== 0) {
  process.exit(twCode);
}

const craCode = await run("react-scripts", ["build"]);
process.exit(craCode);
