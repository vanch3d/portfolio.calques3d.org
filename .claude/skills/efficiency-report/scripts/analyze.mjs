#!/usr/bin/env node
// Parses this project's Claude Code session transcripts (~/.claude/projects/<encoded-cwd>/*.jsonl)
// and reports tool-call volume + result size by category (graphify / rtk / raw Read-Grep-Glob-Bash),
// as a proxy for whether graphify and rtk are actually reducing context/token cost.
//
// Proxy, not ground truth: we don't have the tokenizer Anthropic bills against, so "tokens" below
// is chars/4 on tool_result content. Good enough for relative before/after and category comparison,
// not for reconciling against a real invoice.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const HOOK_INSTALLED = new Date("2026-09-12T16:09:39+01:00"); // commit f0018fb: hook-guard added to settings.json

function encodedProjectDir(cwd) {
  return cwd.replace(/[\\/:]/g, "-");
}

function classifyToolUse(name, input) {
  if (name === "Read") return "read";
  if (name === "Grep") return "grep";
  if (name === "Glob") return "glob";
  if (name === "Bash") {
    const cmd = (input?.command || "").trim();
    if (/^graphify\b/.test(cmd)) return "graphify";
    if (/^rtk\b/.test(cmd)) return "rtk";
    if (/\b(grep|rg|cat|find|ls)\b/.test(cmd.split(" ")[0] || "")) return "bash-search";
    return "bash-other";
  }
  return null; // not counted
}

function contentLength(content) {
  if (typeof content === "string") return content.length;
  if (Array.isArray(content)) {
    return content.reduce((sum, block) => {
      if (typeof block?.text === "string") return sum + block.text.length;
      if (typeof block === "string") return sum + block.length;
      return sum + JSON.stringify(block ?? "").length;
    }, 0);
  }
  return JSON.stringify(content ?? "").length;
}

async function parseFile(filePath, rows) {
  const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });
  const pending = new Map(); // tool_use_id -> { category, timestamp }

  for await (const line of rl) {
    if (!line.trim()) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }

    if (obj.type === "assistant" && Array.isArray(obj.message?.content)) {
      for (const block of obj.message.content) {
        if (block.type === "tool_use") {
          const category = classifyToolUse(block.name, block.input);
          if (category) {
            pending.set(block.id, { category, timestamp: obj.timestamp });
          }
        }
      }
    }

    if (obj.type === "user" && Array.isArray(obj.message?.content)) {
      for (const block of obj.message.content) {
        if (block.type === "tool_result" && pending.has(block.tool_use_id)) {
          const { category, timestamp } = pending.get(block.tool_use_id);
          pending.delete(block.tool_use_id);
          rows.push({
            category,
            timestamp,
            chars: contentLength(block.content),
          });
        }
      }
    }
  }
}

async function main() {
  const cwd = process.argv[2] || process.cwd();
  const projectDir = path.join(homedir(), ".claude", "projects", encodedProjectDir(cwd));

  let files;
  try {
    files = readdirSync(projectDir).filter((f) => f.endsWith(".jsonl"));
  } catch (e) {
    console.error(`Could not read ${projectDir}: ${e.message}`);
    process.exit(1);
  }

  const rows = [];
  for (const f of files) {
    await parseFile(path.join(projectDir, f), rows);
  }

  rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const buckets = {};
  for (const row of rows) {
    const period = new Date(row.timestamp) < HOOK_INSTALLED ? "before" : "after";
    const key = `${row.category}:${period}`;
    buckets[key] ??= { calls: 0, chars: 0 };
    buckets[key].calls += 1;
    buckets[key].chars += row.chars;
  }

  const categories = ["read", "grep", "glob", "bash-search", "bash-other", "graphify", "rtk"];
  console.log(`Transcripts scanned: ${files.length} files, ${rows.length} tool calls`);
  console.log(`Hook install boundary: ${HOOK_INSTALLED.toISOString()}\n`);
  console.log(
    "category".padEnd(12) +
      "period".padEnd(8) +
      "calls".padStart(7) +
      "avg tok/call".padStart(14) +
      "total tok".padStart(12)
  );
  console.log("-".repeat(53));
  for (const cat of categories) {
    for (const period of ["before", "after"]) {
      const b = buckets[`${cat}:${period}`];
      if (!b) continue;
      const tok = Math.round(b.chars / 4);
      const avg = Math.round(tok / b.calls);
      console.log(
        cat.padEnd(12) + period.padEnd(8) + String(b.calls).padStart(7) + String(avg).padStart(14) + String(tok).padStart(12)
      );
    }
  }

  // Adoption check: raw source-code lookups (read/grep/glob/bash-search) vs graphify query/explain/path,
  // in the "after" period only — this is what tells us whether the hook is actually changing behavior.
  const afterRaw = ["read", "grep", "glob", "bash-search"].reduce(
    (sum, cat) => sum + (buckets[`${cat}:after`]?.calls || 0),
    0
  );
  const afterGraphify = buckets["graphify:after"]?.calls || 0;
  console.log(
    `\nAfter hook install: ${afterRaw} raw Read/Grep/Glob/Bash-search calls vs ${afterGraphify} graphify query/explain/path calls.`
  );
  if (afterRaw > 0) {
    console.log(`Adoption ratio: ${((afterGraphify / (afterRaw + afterGraphify)) * 100).toFixed(1)}% of lookups went through graphify.`);
  }
}

main();
