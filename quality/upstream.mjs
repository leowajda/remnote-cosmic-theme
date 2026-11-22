import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
});
try {
  const page = await browser.newPage();
  await page.goto("https://plugins.remnote.com/custom-css");
  const blocks = page.locator("article code.relative");
  const groups = blocks.filter({ has: page.locator("span.absolute") });
  if (!(await groups.count()))
    throw new Error("No expandable CSS blocks found");
  for (const group of await groups.all()) await group.dispatchEvent("click");
  const names = await page
    .locator("article code.relative, article code.select-all")
    .evaluateAll((rows) =>
      [
        ...new Set(
          rows.map((row) => {
            const copy = row.cloneNode(true);
            copy.querySelector("span.absolute")?.remove();
            return copy.textContent.trim();
          }),
        ),
      ].sort(),
    );
  if (
    names.length <= (await blocks.count()) ||
    names.some((n) => !/^\.[\w-]+$/.test(n))
  )
    throw new Error(
      "Unexpected CSS class inventory; inspect the documentation",
    );
  console.log(names.map((n) => n.slice(1)).join("\n"));
} finally {
  await browser.close();
}
