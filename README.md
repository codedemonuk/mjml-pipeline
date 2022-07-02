# MJML Pipeline

An efficient pipeline for generating HTML emails from Markdown source.

## Background

1. Convert Markdown to MJML (based on templates)
1. Convert MJML to HTML
1. Inline CSS
1. Minify HTML
1. Accessibility check

Emails should be created in the `src/markdown` folder with a `.md` extension.
The MJML templates should be in the `src/mjml` folder with an `.mjml` extension.

The gulp file will process the markdown files and drop them into the `dist` folder in MJML, minified, and non-minified versions.

The non-minified versions will make it easier to fix any WCAG violations by helping to identify the specific code fragment that is in violation.

## Commands

### Build HTML only

```bash
yarn gulp build-only
```

### Build HTML and a11y Check

```bash
yarn gulp
```
