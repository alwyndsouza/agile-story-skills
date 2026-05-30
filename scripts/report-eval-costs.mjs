import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const resultsDir = process.argv[2] ?? "promptfoo-results";

function asNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

function formatMoney(value) {
  return `$${value.toFixed(6)}`;
}

function statusFor(result) {
  if (result.success) {
    return "PASS";
  }
  if (result.error) {
    return "ERROR";
  }
  return "FAIL";
}

function tokenUsageOf(value) {
  return {
    prompt: asNumber(value?.prompt),
    completion: asNumber(value?.completion),
    total: asNumber(value?.total)
  };
}

function addTokens(left, right) {
  left.prompt += right.prompt;
  left.completion += right.completion;
  left.total += right.total;
  return left;
}

function sumGradingTokens(result) {
  const total = { prompt: 0, completion: 0, total: 0 };
  for (const component of result.gradingResult?.componentResults ?? []) {
    addTokens(total, tokenUsageOf(component.tokensUsed));
  }
  return total;
}

function inferRates(results) {
  let promptSquared = 0;
  let promptCompletion = 0;
  let completionSquared = 0;
  let promptCost = 0;
  let completionCost = 0;

  for (const result of results) {
    const cost = asNumber(result.cost ?? result.response?.cost);
    const tokens = tokenUsageOf(result.response?.tokenUsage);
    if (!cost || (!tokens.prompt && !tokens.completion)) {
      continue;
    }
    promptSquared += tokens.prompt * tokens.prompt;
    promptCompletion += tokens.prompt * tokens.completion;
    completionSquared += tokens.completion * tokens.completion;
    promptCost += tokens.prompt * cost;
    completionCost += tokens.completion * cost;
  }

  const determinant = promptSquared * completionSquared - promptCompletion * promptCompletion;
  if (Math.abs(determinant) < 1e-9) {
    return null;
  }

  const input = (promptCost * completionSquared - completionCost * promptCompletion) / determinant;
  const output = (promptSquared * completionCost - promptCompletion * promptCost) / determinant;
  if (!Number.isFinite(input) || !Number.isFinite(output) || input < 0 || output < 0) {
    return null;
  }

  return { input, output };
}

function costForTokens(tokens, rates) {
  if (!rates) {
    return 0;
  }
  return tokens.prompt * rates.input + tokens.completion * rates.output;
}

function markdownTable(rows) {
  const lines = [
    "| Eval | Test | Status | Model output | Grading est. | Total est. | Tokens |",
    "|---|---:|---|---:|---:|---:|---:|"
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.evalName} | ${row.testNumber} | ${row.status} | ${formatMoney(row.outputCost)} | ` +
        `${formatMoney(row.gradingCost)} | ${formatMoney(row.totalCost)} | ${row.tokens.total} |`
    );
  }

  return lines.join("\n");
}

if (!existsSync(resultsDir)) {
  console.log(`No promptfoo result directory found at ${resultsDir}; skipping cost report.`);
  process.exit(0);
}

const resultFiles = readdirSync(resultsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (resultFiles.length === 0) {
  console.log(`No promptfoo JSON result files found in ${resultsDir}; skipping cost report.`);
  process.exit(0);
}

const rows = [];
const subtotals = [];
const grand = {
  outputCost: 0,
  gradingCost: 0,
  totalCost: 0,
  tokens: { prompt: 0, completion: 0, total: 0 }
};

for (const file of resultFiles) {
  const fullPath = path.join(resultsDir, file);
  const report = JSON.parse(readFileSync(fullPath, "utf8"));
  const results = report.results?.results ?? [];
  const rates = inferRates(results);
  const evalName = file.replace(/\.json$/, "");
  const subtotal = {
    evalName,
    outputCost: 0,
    gradingCost: 0,
    totalCost: 0,
    tokens: { prompt: 0, completion: 0, total: 0 }
  };

  for (const result of results) {
    const outputCost = asNumber(result.cost ?? result.response?.cost);
    const outputTokens = tokenUsageOf(result.response?.tokenUsage);
    const gradingTokens = sumGradingTokens(result);
    const gradingCost = costForTokens(gradingTokens, rates);
    const totalCost = outputCost + gradingCost;
    const tokens = addTokens({ ...outputTokens }, gradingTokens);

    rows.push({
      evalName,
      testNumber: asNumber(result.testIdx) + 1,
      status: statusFor(result),
      outputCost,
      gradingCost,
      totalCost,
      tokens
    });

    subtotal.outputCost += outputCost;
    subtotal.gradingCost += gradingCost;
    subtotal.totalCost += totalCost;
    addTokens(subtotal.tokens, tokens);
  }

  subtotals.push(subtotal);
  grand.outputCost += subtotal.outputCost;
  grand.gradingCost += subtotal.gradingCost;
  grand.totalCost += subtotal.totalCost;
  addTokens(grand.tokens, subtotal.tokens);
}

const subtotalLines = [
  "| Eval | Model output | Grading est. | Total est. | Tokens |",
  "|---|---:|---:|---:|---:|"
];

for (const subtotal of subtotals) {
  subtotalLines.push(
    `| ${subtotal.evalName} | ${formatMoney(subtotal.outputCost)} | ` +
      `${formatMoney(subtotal.gradingCost)} | ${formatMoney(subtotal.totalCost)} | ` +
      `${subtotal.tokens.total} |`
  );
}

subtotalLines.push(
  `| **Grand total** | **${formatMoney(grand.outputCost)}** | ` +
    `**${formatMoney(grand.gradingCost)}** | **${formatMoney(grand.totalCost)}** | ` +
    `**${grand.tokens.total}** |`
);

const markdown = [
  "## Promptfoo Eval Cost Summary",
  "",
  markdownTable(rows),
  "",
  "### Totals",
  "",
  subtotalLines.join("\n"),
  "",
  "_Costs are promptfoo-reported model output cost plus grading cost estimated from the same provider rates inferred from promptfoo result cost fields._",
  ""
].join("\n");

console.log(markdown);

const outputPath = path.join(resultsDir, "cost-summary.md");
writeFileSync(outputPath, markdown);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}
