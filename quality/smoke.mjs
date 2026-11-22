import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

if (!process.env.CHROME_BIN) {
  console.log("CHROME_BIN not set; browser smoke skipped.");
  process.exit(0);
}

const css = readFileSync("dist/theme.css", "utf8");
const fixture = `<!doctype html><meta charset="utf-8">
<div id="shell-mode" class="light">
  <div class="rn-popup__content" id="sheet">
    <div class="rn-editor-container" id="embedded">Preview</div>
    <div class="rn-study-deck-btn" id="due">
      <button id="due-main" data-test="Document Queue Progress Display">343 Due</button><button id="due-more" data-test="Document Queue Progress Display Dropdown">v</button>
    </div>
    <button class="rn-flashcards-home"><span class="bg-[#506cf7]">Practice</span></button>
  </div>
</div>`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
});
try {
  const page = await browser.newPage();
  await page.setContent(fixture);
  await page.addStyleTag({ content: css });
  for (const mode of ["light", "dark"]) {
    const result = await page.evaluate((mode) => {
      const shell = document.querySelector("#shell-mode");
      shell.classList.remove("light", "dark");
      shell.classList.add(mode);
      document.body.className = mode;
      const bg = (sel) =>
        getComputedStyle(document.querySelector(sel)).backgroundColor;
      return {
        embedded: bg("#embedded"),
        sheet: bg("#sheet"),
        wrapper: bg("#due"),
        segment: bg("#due-main"),
        cta: bg("[class*='bg-[#506cf7]']"),
      };
    }, mode);
    assert.notEqual(
      result.embedded,
      result.sheet,
      `${mode}: embedded editor must differ from the sheet surface`,
    );
    assert.equal(
      result.wrapper,
      "rgba(0, 0, 0, 0)",
      `${mode}: due wrapper must not paint behind its segments`,
    );
    assert.notEqual(
      result.segment,
      result.cta,
      `${mode}: due segment must not use the accent fill`,
    );
    assert.equal(
      result.cta,
      mode === "dark" ? "rgb(99, 208, 223)" : "rgb(0, 82, 90)",
      `${mode}: practice CTA must use the accent`,
    );
  }
  console.log(
    "Browser smoke passed: nested surfaces, split button and flashcard CTA in light and dark.",
  );
} finally {
  await browser.close();
}
