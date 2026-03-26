import { generateTheme } from "./index";

const hex = process.argv[2] || "#6366f1";
const theme = generateTheme(hex);

console.log(`\nTheme generated from: ${theme.input}\n`);
console.log("=== LIGHT THEME ===");
console.log(JSON.stringify(theme.light, null, 2));
console.log("\n=== DARK THEME ===");
console.log(JSON.stringify(theme.dark, null, 2));
console.log("\n=== CONTRAST AUDIT (Light) ===");
for (const [pair, result] of Object.entries(theme.contrast.light)) {
  const status = result.aa ? "PASS AA" : result.aaLarge ? "PASS AA-Large" : "FAIL";
  console.log(`  ${pair}: ${result.ratio}:1 [${status}]`);
}
console.log("\n=== CONTRAST AUDIT (Dark) ===");
for (const [pair, result] of Object.entries(theme.contrast.dark)) {
  const status = result.aa ? "PASS AA" : result.aaLarge ? "PASS AA-Large" : "FAIL";
  console.log(`  ${pair}: ${result.ratio}:1 [${status}]`);
}
console.log("\n=== CSS VARIABLES ===");
console.log(theme.css);
