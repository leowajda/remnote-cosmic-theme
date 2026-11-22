import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { generate, parse, walk } from "css-tree";

const read = (p) => readFileSync(p, "utf8");
const hooks = read("quality/hooks.txt").trim().split("\n").sort();
assert.ok(
  hooks.length > 300 && hooks.every((h) => /^rn-[a-z0-9_-]+$/.test(h)),
  "Unexpected hook inventory",
);

const components = readdirSync("src/components")
  .filter((f) => f.endsWith(".css"))
  .sort();
const perFile = {},
  bound = new Map();
for (const file of components) {
  const classes = new Set(),
    internal = new Set();
  walk(parse(read(`src/components/${file}`)), (node) => {
    if (node.type === "ClassSelector") {
      classes.add(node.name);
      if (!hooks.includes(node.name) && !["dark", "light"].includes(node.name))
        internal.add(generate(node));
    }
    if (
      node.type === "AttributeSelector" &&
      /^(data-|id$|style$|class$)/.test(node.name.name)
    )
      internal.add(generate(node));
    if (node.type === "IdSelector") internal.add(generate(node));
  });
  perFile[file] = { classes, internal: [...internal].sort() };
  for (const name of classes) if (!bound.has(name)) bound.set(name, file);
}

const typography = /^rn-(fontsize|lineheight|text|fontweight)-/;
const classify = {};
for (const name of hooks) {
  if (name === "rn-clr-content-pirmary") classify[name] = "documented-typo";
  else if (bound.has(name)) classify[name] = bound.get(name);
  else if (/^rn-(clr|colors|shadow)-/.test(name)) classify[name] = "token";
  else if (typography.test(name)) classify[name] = "native-typography";
  else if (/^(rn-override|rn-usersnap-override|rn-text)$/.test(name))
    classify[name] = "native-behavior";
  else classify[name] = "native-layout";
}
const exceptions = {};
for (const file of components) exceptions[file] = perFile[file].internal;

writeFileSync(
  "quality/upstream.sha256",
  createHash("sha256")
    .update(hooks.join("\n") + "\n")
    .digest("hex") + "\n",
);
writeFileSync("quality/hooks.json", JSON.stringify(classify, null, 2) + "\n");
writeFileSync(
  "quality/host-selectors.json",
  JSON.stringify(exceptions, null, 2) + "\n",
);
console.log(
  `Pinned ${hooks.length} documented hooks. Review hooks.json before committing.`,
);
