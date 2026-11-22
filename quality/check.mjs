import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import Ajv from "ajv";
import { generate, parse, walk } from "css-tree";

const read = (path) => readFileSync(path, "utf8");
const hooks = JSON.parse(read("quality/hooks.json"));
const names = Object.keys(hooks).sort();
const fingerprint = createHash("sha256")
  .update(names.join("\n") + "\n")
  .digest("hex");
assert.equal(
  fingerprint,
  read("quality/upstream.sha256").trim(),
  "Documented hook set differs from upstream pin",
);

const components = readdirSync("src/components").filter((f) =>
  f.endsWith(".css"),
);
const schema = {
  type: "object",
  propertyNames: { pattern: "^rn-[a-z0-9_-]+$" },
  additionalProperties: {
    anyOf: [
      {
        enum: [
          "token",
          "native-layout",
          "native-typography",
          "native-behavior",
          "documented-typo",
          ...components,
        ],
      },
      { pattern: "^inherit:rn-[a-z0-9_-]+$", type: "string" },
    ],
  },
};
const validate = new Ajv({ allErrors: true }).compile(schema);
assert.ok(validate(hooks), JSON.stringify(validate.errors));
const tokens = new Set();
walk(parse(read("src/remnote.css")), {
  visit: "Declaration",
  enter: (n) => tokens.add(n.property),
});
const exceptions = JSON.parse(read("quality/host-selectors.json"));
assert.deepEqual(Object.keys(exceptions).sort(), components.sort());
for (const file of components) {
  const classes = new Set(),
    internal = new Set();
  walk(parse(read(`src/components/${file}`)), (n) => {
    if (n.type === "ClassSelector") {
      classes.add(n.name);
      if (!Object.hasOwn(hooks, n.name) && !["dark", "light"].includes(n.name))
        internal.add(generate(n));
    }
    if (
      n.type === "AttributeSelector" &&
      /^(data-|id$|style$|class$)/.test(n.name.name)
    )
      internal.add(generate(n));
  });
  for (const name of names.filter((n) => hooks[n] === file))
    assert.ok(classes.has(name), `${name}: missing selector in ${file}`);
  assert.deepEqual(
    [...internal].sort(),
    exceptions[file],
    `${file}: review changed non-contract selectors`,
  );
}
for (const name of names.filter((n) => hooks[n] === "token"))
  assert.ok(tokens.has(`--${name}`), `${name}: missing host token`);
for (const name of names.filter((n) => hooks[n].startsWith("inherit:"))) {
  const owner = hooks[name].slice("inherit:".length);
  assert.ok(
    components.includes(hooks[owner]) || hooks[owner] === "token",
    `${name}: unbound paint owner ${owner}`,
  );
}

const stock = ["506cf7", "5098ff", "004ef1", "002d8b"];
const compiled = [
  read("src/tokens.css"),
  read("src/remnote.css"),
  ...components.map((f) => read(`src/components/${f}`)),
].join("\n");
walk(parse(compiled), {
  visit: "Declaration",
  enter(n) {
    const value = generate(n.value).toLowerCase();
    for (const hex of stock)
      assert.ok(!value.includes(hex), `Stock color #${hex} in ${n.property}`);
  },
});
console.log(
  `${names.length}/${names.length} documented hooks classified; component bindings, tokens, host selectors and stock colors checked.`,
);
