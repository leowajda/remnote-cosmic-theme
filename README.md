# COSMIC for RemNote

Charcoal for late-night reading, soft gray for daylight. COSMIC uses cyan for links, selections, and keyboard focus so your own highlights still stand out.

![A RemNote document in dark mode with a charcoal editor, cyan references, and highlighted notes][desktop-dark]

**Install:** Look for **COSMIC for RemNote** in RemNote’s Theme Marketplace, or [download the theme ZIP](https://github.com/leowajda/remnote-cosmic-theme/raw/refs/heads/master/releases/cosmic-0.5.3.zip). Choose Light or Dark in RemNote’s interface settings.

## The same notes, in daylight

Light mode pairs a soft-gray workspace with lighter controls and a deep teal accent. Switch appearances without losing the distinction between a link and a passage you highlighted.

![The same desktop document in light mode, with teal references and the same authored highlights][desktop-light]

## Review a card

The prompt and answer stay at the center of the study queue. Grading buttons keep their labels and feedback colors, separate from the cyan used for navigation.

![A revealed desktop flashcard with the answer and grading controls visible][desktop-study]

## Read a PDF

Set the reader’s **Appearance** to **Dark** to get charcoal paper, or let it follow a dark workspace. Light, Sepia, Invert, and print keep RemNote’s own rendering. The dark adjustment replaces the exact stock paper color; pixels of that same color in a diagram can change too.

![A PDF open in the desktop reader showing charcoal paper, an annotation, and the reader toolbar][desktop-pdf]

## Development

Edit the palette in `src/tokens.css`, RemNote’s color mappings in `src/remnote.css`, or individual views in `src/components/`. With Node 24 and `zip` installed, run `npm ci`, `npm run check`, and `npm run build`. The archive is written to `dist/cosmic.zip`; its installation ID is `cosmic-dark`.

[desktop-dark]: assets/desktop-dark.png
[desktop-light]: assets/desktop-light.png
[desktop-study]: assets/desktop-study.png
[desktop-pdf]: assets/desktop-pdf.png
