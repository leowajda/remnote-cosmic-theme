# COSMIC

A charcoal dark theme and a soft-gray light theme for RemNote. Cyan marks links, selection, and keyboard focus; note highlights and flashcard grades keep their own colors.

**Install:** Look for **COSMIC for RemNote** in the Theme Marketplace, or [download the theme ZIP](https://github.com/leowajda/remnote-cosmic-theme/raw/refs/heads/master/releases/cosmic-0.5.3.zip). Choose Light or Dark in RemNote’s interface settings.

**PDFs:** Set the reader’s appearance to **Dark** for charcoal paper. Light, Sepia, Invert, and print use RemNote’s own rendering. In dark mode, diagram pixels that match the original paper color also change.

**Development:** Edit `src/tokens.css` for the palette, `src/remnote.css` for host color mappings, and `src/components/` for individual views. With Node 24 and `zip` installed, run `npm ci`, `npm run check`, then `npm run build`. The installable archive is `dist/cosmic.zip`.
