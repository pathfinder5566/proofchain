import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "../frontend/node_modules/jspdf/dist/jspdf.es.min.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "docs", "ProofChain-Judge-Concept-Guide.md");
const outputPath = path.join(root, "docs", "ProofChain-Judge-Concept-Guide.pdf");

const markdown = fs.readFileSync(inputPath, "utf8");
const doc = new jsPDF({ unit: "pt", format: "a4" });
const page = {
  width: doc.internal.pageSize.getWidth(),
  height: doc.internal.pageSize.getHeight(),
  margin: 48
};
let y = page.margin;

function addPageIfNeeded(height = 16) {
  if (y + height > page.height - page.margin) {
    doc.addPage();
    y = page.margin;
  }
}

function writeLine(text, options = {}) {
  const {
    size = 10.5,
    style = "normal",
    color = [30, 41, 59],
    spacing = 15,
    indent = 0,
    maxWidth = page.width - page.margin * 2 - indent
  } = options;
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    addPageIfNeeded(spacing);
    doc.text(line, page.margin + indent, y);
    y += spacing;
  }
}

function blank(amount = 8) {
  y += amount;
}

function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

const lines = markdown.split(/\r?\n/);
let inCode = false;

for (const rawLine of lines) {
  const line = rawLine.trimEnd();
  if (line.startsWith("```")) {
    inCode = !inCode;
    blank(4);
    continue;
  }
  if (inCode) {
    writeLine(line || " ", {
      size: 9,
      color: [15, 23, 42],
      spacing: 12,
      indent: 14,
      maxWidth: page.width - page.margin * 2 - 14
    });
    continue;
  }
  if (!line.trim()) {
    blank(6);
    continue;
  }
  if (line.startsWith("# ")) {
    addPageIfNeeded(42);
    writeLine(stripInlineMarkdown(line.replace(/^# /, "")), {
      size: 24,
      style: "bold",
      color: [15, 118, 110],
      spacing: 30
    });
    blank(6);
    continue;
  }
  if (line.startsWith("## ")) {
    addPageIfNeeded(36);
    blank(8);
    writeLine(stripInlineMarkdown(line.replace(/^## /, "")), {
      size: 15,
      style: "bold",
      color: [7, 17, 31],
      spacing: 20
    });
    blank(2);
    continue;
  }
  if (line.startsWith("### ")) {
    addPageIfNeeded(28);
    writeLine(stripInlineMarkdown(line.replace(/^### /, "")), {
      size: 12,
      style: "bold",
      color: [15, 118, 110],
      spacing: 17
    });
    continue;
  }
  if (line.startsWith("- ")) {
    writeLine(`- ${stripInlineMarkdown(line.slice(2))}`, { indent: 12 });
    continue;
  }
  if (/^\d+\.\s/.test(line)) {
    writeLine(stripInlineMarkdown(line), { indent: 12 });
    continue;
  }
  writeLine(stripInlineMarkdown(line));
}

const totalPages = doc.getNumberOfPages();
for (let i = 1; i <= totalPages; i += 1) {
  doc.setPage(i);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ProofChain Judge Concept Guide", page.margin, page.height - 24);
  doc.text(`Page ${i} of ${totalPages}`, page.width - page.margin - 54, page.height - 24);
}

fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
console.log(`Generated ${outputPath}`);
