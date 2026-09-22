import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// Accept standard Next.js flags and the managed preview runner's equivalent flags.
const require = createRequire(import.meta.url);
const args = process.argv
  .slice(2)
  .filter((arg) => arg !== "--strictPort")
  .map((arg) => (arg === "--host" ? "--hostname" : arg));
if (!args.includes("--hostname") && !args.includes("-H"))
  args.push("--hostname", "0.0.0.0");
if (!args.includes("--port") && !args.includes("-p"))
  args.push("--port", "4173");
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", ...args],
  {
    stdio: "inherit",
    env: process.env,
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 0;
});
