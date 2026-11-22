# COSMIC

A charcoal dark theme and a soft-gray light theme for RemNote. Cyan marks links, selection, and keyboard focus; note highlights and flashcard grades keep their own colors.

**Install:** Look for **COSMIC for RemNote** in the Theme Marketplace, or [download the theme ZIP](https://github.com/leowajda/remnote-cosmic-theme/raw/refs/heads/master/releases/cosmic-0.5.4.zip). Choose Light or Dark in RemNote’s interface settings.

**PDFs:** Set the reader’s appearance to **Dark** for charcoal paper. Light, Sepia, Invert, and print use RemNote’s own rendering. In dark mode, diagram pixels that match the original paper color also change.

## Development

Edit `src/tokens.css` for the palette, `src/remnote.css` for host color mappings, and `src/components/` for individual views. With Node 24 and `zip` installed, run `npm ci`, `npm run check`, then `npm run build`. The installable archive is `dist/cosmic.zip`.

To test in the real app, paste the generated `dist/theme.css` into a blank CSS block in RemNote’s **Custom CSS** power-up. Styles apply as you edit. Remove that block before testing the packaged theme so the two copies do not overlap. RemNote’s **CSS Selector Helper** and browser DevTools identify which element paints a surface.

## Quality contract

`quality/hooks.txt` pins the 370 documented classes from RemNote’s Custom CSS page. `quality/hooks.json` records a decision for each: a COSMIC component, a host token, or intentional native behavior. `npm run check` fails if a decision is missing, a bound selector disappears, a host token is absent, an undocumented selector changes, or a stock blue reappears in a declaration.

Refresh the contract when RemNote updates its documentation:

```sh
CHROME_BIN=/path/to/chrome npm run upstream:refresh
```

Review the resulting `quality/hooks.json` diff before committing. `npm run check:browser` runs a Chromium cascade check for nested popup surfaces, the split Due button, and the Flashcards action in light and dark; it needs `CHROME_BIN` and is separate from the fast CI job.
