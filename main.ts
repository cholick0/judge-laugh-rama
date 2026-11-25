import * as fs from "node:fs";
import * as path from "node:path";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space, a single line about office life.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

const ENTRY =
  "HR sent a condolence email when the office plant died. The plant got more support than I did.";

function validateEntry(entry: string): void {
  const chars = [...entry].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (entry.trim().length === 0) {
    throw new Error("Entry must not be only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("Entry must be a single line");
  }
}

function main(): void {
  validateEntry(ENTRY);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  // Byte-level read-back: the file on disk must match the entry exactly.
  const readBack = fs.readFileSync(OUTPUT_PATH);
  const expected = Buffer.from(ENTRY, "utf8");
  if (!readBack.equals(expected)) {
    throw new Error("Read-back mismatch: file bytes differ from entry");
  }
  console.log(
    `Wrote ${[...ENTRY].length} characters to ${OUTPUT_PATH} (verified byte-for-byte)`,
  );
}

main();
